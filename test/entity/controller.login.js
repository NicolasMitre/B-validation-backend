"use strict";

const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server/server");
const utils = require("../../helper/util");

chai.use(chaiHttp);

const username = "nicolasmelluso7@gmail.com";
const password = "1234";
let access_token = "";

describe("Controller.login", function() {
  describe("Login", function() {
    it("Error while loging in with wrong username/password combination", function(done) {
      const wrongUsername = utils.generateString(10);
      const wrongPassword = utils.generateString(10);

      chai
        .request(app)
        .post("/api/login")
        .set("Content-type", "application/json")
        .send({ username: wrongUsername, password: wrongPassword })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          return done();
        });
    });

    it("Loging in with the correct data", function(done) {
      chai
        .request(app)
        .post("/api/login")
        .set("Content-type", "application/json")
        .send({ username: username, password: password })
        .end(function(err, res) {
          access_token = res.body.access_token;
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          return done();
        });
    });
  });

  describe("Logout", function() {
    it("Error Loging out because of lack of authorization", function(done) {
      chai
        .request(app)
        .post("/api/logout")
        .set("Content-type", "application/json")
        .end(function(err, res) {
          expect(res).to.have.status(401);
          return done();
        });
    });

    it("User Logged out successfully", function(done) {
      chai
        .request(app)
        .post("/api/logout")
        .set("Content-type", "application/json")
        .set("Authorization", "Bearer " + access_token)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          return done();
        });
    });
  });
});
