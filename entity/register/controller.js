"use strict";

const crypto = require("crypto");
const async = require("async");
const mysqlService = require("../../services/mysql.js");
const queries = require("./queries.js");

// POST by body. This function add a new user in the data base with his password hashed.

const register = (req, res) => {
  const { username, password } = req.body;

  async.waterfall(
    [
      cb => {
        mysqlService.getConnection((err, conn) => {
          return cb(err, conn);
        });
      },
      (conn, cb) => {
        mysqlService.startTransaction(conn, err => {
          return cb(err, conn);
        });
      },
      (conn, cb) => {
        const hashedPassword = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");

        const user = {
          username,
          password: hashedPassword
        };
        conn.query(queries.insertUser, [user], (err, result) => {
          if (err) {
            return cb(err, conn);
          }

          return cb(null, conn, result.userId);
        });
      }
    ],
    (err, conn, userId) => {
      if (err) {
        if (conn) {
          mysqlService.closeConnection(conn);
        }
        return res.status(500).send("Internal Server Error.");
      } else {
        mysqlService.commitTransaction(conn, err => {
          if (err) {
            res.status(500).send("Internal server Error");
          }
          res.status(200).json({
            username: username,
            password: password
          });
        });
      }
    }
  );
};

module.exports = {
  register
};
