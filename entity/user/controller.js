"use strict";

const async = require("async");
const mysqlService = require("../../services/mysql.js");
const queries = require("./queries.js");
const redisService = require("../../services/redis");
const crypto = require("crypto");
const util = require("../../helper/util.js");
const emailService = require("../../services/mailer");

const getLoggedUser = (req, res) => {
  redisService.get(`TOKEN_${req.session.token}`, (err, results) => {
    if (err) {
      return res.status(500).send("Internal Server Error.");
    }
    if (!results) {
      // 0 or 1
      return res.status(400).send("Can't Retrieve data");
    }
    const { id, username } = JSON.parse(results);
    res.json({ id, username });
  });
};

const changePassword = (req, res) => {
  const { password, newpassword } = req.body;

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

        conn.query(queries.getPass, [hashedPassword], (err, result) => {
          if (err) {
            return cb(err, conn);
          }
          return cb(null, conn, result);
        });
      },
      (conn, result, cb) => {
        const newhashedPassword = crypto
          .createHash("sha256")
          .update(newpassword)
          .digest("hex");

        conn.query(
          queries.putNewPass,
          [newhashedPassword, result[0].password],
          (err, result) => {
            if (err) {
              return cb(err, conn);
            }
            return cb(null, conn, result);
          }
        );
      }
    ],
    (err, conn, result) => {
      if (err) {
        if (conn) {
          mysqlService.closeConnection(conn);
        }
        return res.status(500).send("Internal Server Error.");
      } else {
        mysqlService.commitTransaction(conn, err => {
          if (err) {
            return res.status(500).send("Internal Server Error.");
          }
          return res.send(result);
        });
      }
    }
  );
};
const sendEmail = (req, res) => {
  const { email } = req.body;
  const resetCode = util.generateString(6);

  redisService.insert(`RESET_${resetCode}`, email, 600, err => {
    if (err) {
      return res.status(500).send("Error trying to send reset code");
    }

    const params = {
      from: "nicolasmelluso7@gmail.com",
      to: email,
      subject: `Hi ${email}, this is your reset password code!`
    };

    const content = `<p>Your reset code is:</br>${resetCode}.</br></br>
        Please note that it can be used only in the next 10 minutes. 
        </br></br></br>
        Have a nice day!
        </p>`;

    emailService.send(params, content, (err, info) => {
      if (err) {
        return res.status(500).send("Internal Server Error.");
      }
      return res.status(200).send(info);
    });
  });
};

const passwordRecovered = (req, res) => {
  const { email, password, resetCode } = req.body;

  redisService.get(`RESET_${resetCode}`, (err, result) => {
    if (err) {
      return res.status(500).send("Internal Server Error.");
    }

    if (!result) {
      return res.status(400).send("Your reset code isn't valid.");
    }
  });

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
        const newpass = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
        conn.query(queries.setPass, [newpass, email], (err, result) => {
          if (err) {
            return cb(err, conn);
          }

          return cb(null, conn, password);
        });
      }
    ],
    (err, conn, password) => {
      if (err) {
        if (conn) {
          mysqlService.closeConnection(conn);
        }

        return res.status(500).send("Internal Server Error.");
      } else {
        mysqlService.commitTransaction(conn, err => {
          if (err) {
            return res.status(500).send("Internal Server Error.");
          }
          return res.status(200).json(password);
        });
      }
    }
  );
};

const users = (req, res) => {
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
        conn.query(queries.getUser, [req.params.username], (err, result) => {
          if (err) {
            return cb(err, conn);
          }

          return cb(null, conn, result);
        });
      }
    ],
    (err, conn, user) => {
      if (err) {
        if (conn) {
          mysqlService.closeConnection(conn);
        }

        return res.status(500).send("Internal Server Error.");
      } else {
        mysqlService.commitTransaction(conn, err => {
          if (err) {
            return res.status(500).send("Internal Server Error.");
          }

          return res.json(user[0]);
        });
      }
    }
  );
};

module.exports = {
  users,
  sendEmail,
  getLoggedUser,
  changePassword,
  passwordRecovered
};
