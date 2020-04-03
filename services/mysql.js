"use strict";

const mysql = require("mysql2");
const config = require("../config/config");

const pool = mysql.createPool(config.db);

exports.getConnection = cb => {
  pool.getConnection((err, conn) => {
    return cb(err, conn);
  });
};

exports.startTransaction = (conn, cb) => {
  conn.beginTransaction(err => {
    return cb(err);
  });
};

exports.executeQuery = (query, params, cb) => {
  pool.getConnection((err, conn) => {
    if (err) {
      return cb(err);
    }

    conn.query(query, params, (err, results, fields) => {
      conn.release();

      return cb(err, results, fields);
    });
  });
};

exports.commitTransaction = (conn, cb) => {
  conn.commit(err => {
    if (err) {
      conn.rollback(() => {
        conn.release();
        return cb(err);
      });
    } else {
      conn.release();
      return cb();
    }
  });
};

exports.cancelTransaction = (conn, cb) => {
  conn.rollback(() => {
    conn.release();
    return cb();
  });
};

exports.closeConnection = conn => {
  return conn.release();
};
