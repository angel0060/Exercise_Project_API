const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Prevent duplicate email
 * @param {string} email - Email
 * @returns {boolean}
 */
async function preventDuplicateEmail(email) {
  const findDuplicate = await User.find({ email: email }).exec();

  if (findDuplicate.length === 0) {
    // if duplicate not found
    return false;
  } else {
    // if duplicate is found
    return true;
  }
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Check old password
 * @param {string} id - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(id, password) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        password,
      },
    }
  );
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  preventDuplicateEmail,
  changePassword,
};
