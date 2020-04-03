const mysqlService = require("../../services/mysql.js");
const queries = require("./queries.js");
const redisService = require("../../services/redis");
const crypto = require("crypto");
const util = require("../../helper/util");

// Generate a token login a existent user

const login = (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  mysqlService.executeQuery(
    queries.loginUser,
    [username, hashedPassword],
    (err, results, fields) => {
      if (err) {
        res.status(500).send("Internal error");
        throw err;
      }
      if (results && !results.length) {
        return res.status(400).send("Wrong Username/Password Combination");
      }
      const token = util.generateString(28);
      const result = results[0];

      redisService.insert(
        `TOKEN_${token}`,
        JSON.stringify(result),
        3000,
        err => {
          if (err) {
            return res.status(500).send("I can't insert a Token");
          }
          const resp = {
            user: {
              id: result.id,
              username: result.username
            },
            access_token: token
          };
          return res.status(200).send(resp);
        }
      );
    }
  );
};

// Delete the token and loggout the user.

const logout = (req, res) => {
  redisService.delete(`TOKEN_${req.session.token}`, (err, results) => {
    if (err) {
      return res.status(500).send("Internal Server Error.");
    }
    if (!results) {
      // 0 or 1
      return res.status(400).send("Logout failed");
    }

    return res.status(200).send("Logged out Successfully");
  });
};

module.exports = {
  login,
  logout
};
