const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get user by email
      const user = await User.findOne({ email });
      // match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          resolve(user);
        } else {
          // password did not match
          reject('Authentication failed');
        }
      });
    } catch (err) {
      // email not found
      reject('Authentication failed');
    }
  });
};
