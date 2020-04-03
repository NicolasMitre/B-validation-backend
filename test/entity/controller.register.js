"use strict";

const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server/server");
const utils = require("../../helper/util");

chai.use(chaiHttp);

const username = "nicolasmelluso7@gmail.com";
const password = "1234";

describe("Controller.register", function() {
  describe("User duplicated cannot be register", function() {
    it("Error registering a user because of existing field in DB", function(done) {
      chai
        .request(app)
        .post("/api/register")
        .set("Content-type", "application/json")
        .send({ username: username, password: password })
        .end(function(err, res) {
          expect(res).to.have.status(500);
          return done();
        });
    });

    it("User registered successfully", function(done) {
      const anotherUser = utils.generateString(10);
      const anotherPassword = utils.generateString(10);

      chai
        .request(app)
        .post("/api/register")
        .set("Content-type", "application/json")
        .send({
          username: anotherUser,
          password: anotherPassword
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          return done();
        });
    });

    it("User registered failed because not post username", function(done) {
      const anotherPassword = utils.generateString(10);

      chai
        .request(app)
        .post("/api/register")
        .set("Content-type", "application/json")
        .send({
          password: anotherPassword
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          return done();
        });
    });
  });
});
