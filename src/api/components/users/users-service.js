const usersRepository = require('./users-repository');
const { hashPassword } = require('../../../utils/password');
const { databasePassword } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Prevent duplicate email
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {boolean}
 */
async function preventDuplicateEmail(email) {
  try {
    const checkDuplicate = await usersRepository.preventDuplicateEmail(email);
    if (checkDuplicate == false) {
      return false;
    } else if (checkDuplicate == true) {
      return true;
    }
  } catch (err) {
    return null;
  }
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check old password
 * @param {string} id - User ID
 * @param {string} old_password - Old Password
 * @param {string} new_password - New Password
 * @returns {boolean}
 */
async function checkOldPassword(id, old_password, new_password) {
  const hashedPassword = await hashPassword(new_password);
  const userInfo = await usersRepository.getUser(id);

  if (!userInfo) {
    return null;
  }

  const checkOldPassword = await databasePassword(
    old_password,
    userInfo.password
  );
  if (!checkOldPassword) {
    return null;
  }

  try {
    await usersRepository.changePassword(id, hashedPassword);
  } catch (err) {
    return null;
  }
  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  preventDuplicateEmail,
  checkOldPassword,
};
