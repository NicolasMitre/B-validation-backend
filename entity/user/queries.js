module.exports = {
  getUser: `SELECT id, username FROM users WHERE username = ?`,
  getPass: `SELECT password FROM users where password = ?`,
  putNewPass: `UPDATE users SET password = ? WHERE password=?;`,
  setPass: `UPDATE users SET password = ? WHERE username=?`
};
