const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const confirm_password = request.body.confirm_password;

    // check if password and confirm_password sama
    if (password != confirm_password) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password and Confirm Password is different'
      );
    } else {
      // check if email is already used
      const checkDuplicate = await usersService.preventDuplicateEmail(email);
      if (checkDuplicate == true) {
        throw errorResponder(
          errorTypes.EMAIL_ALREADY_TAKEN,
          'Email already taken'
        );
      } else if (checkDuplicate == false) {
        const success = await usersService.createUser(name, email, password);
        if (!success) {
          throw errorResponder(
            errorTypes.UNPROCESSABLE_ENTITY,
            'Failed to create user'
          );
        }
        return response.status(200).json({ name, email });
      }
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // check if email is already used
    const checkDuplicate = await usersService.preventDuplicateEmail(email);
    if (checkDuplicate == true) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    } else if (checkDuplicate == false) {
      const success = await usersService.updateUser(id, name, email);
      if (!success) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Failed to update user'
        );
      }
      return response.status(200).json({ id });
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    const id = request.params.id;
    const old_password = request.body.old_password;
    const new_password = request.body.new_password;
    const confirm_new_password = request.body.confirm_new_password;

    // check if old password sama dengan new password
    if (old_password == new_password) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Old Password and New Password are the same'
      );
    } else if (new_password != confirm_new_password) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'New Password and Confirm New Password is different'
      );
    } else {
      // check if old password sama dengan password yg di database
      const checkOldPassword = await usersService.checkOldPassword(
        id,
        old_password,
        new_password
      );
      if (!checkOldPassword) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Failed to change password'
        );
      }
      return response.status(200).json({ id, old_password, new_password });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
