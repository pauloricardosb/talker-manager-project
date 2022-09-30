const { randomBytes } = require('crypto');

function token() {
  return randomBytes(8).toString('hex');
}

module.exports = { token };
