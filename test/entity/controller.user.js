"use strict";

const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server/server");
const utils = require("../../helper/util");

chai.use(chaiHttp);

const email = "nicolasmelluso7@gmail.com";

describe("Controller.user", function() {
  describe("Send reset password code", function() {
    it("Error while sending email because of wrong syntax on email", function(done) {
      let wrongEmail = email;
      wrongEmail = wrongEmail.slice(0, 10); // to cut out the '@' and beyond
      chai
        .request(app)
        .post("/api/recovery")
        .set("Content-type", "application/json")
        .send({ email: wrongEmail })
        .end(function(err, res) {
          expect(res).to.have.status(500);
          return done();
        });
    });

    it("Email sent successfully", function(done) {
      chai
        .request(app)
        .post("/api/recovery")
        .set("Content-type", "application/json")
        .send({ email: email })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          return done();
        });
    });
  });

  describe("update Reseted Password", function() {
    it("Error updating password because of wrong reset code", function(done) {
      const wrongResetCode = utils.generateString(10);
      chai
        .request(app)
        .put("/api/recovered")
        .set("Content-type", "application/json")
        .send({
          email: email,
          password: "1234",
          resetCode: wrongResetCode
        })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          return done();
        });
    });

    /*  it("Password updated successfully", function(done) {
      const resetCode = "";
      chai
        .request(app)
        .put("/api/recovered")
        .set("Content-type", "application/json")
        .send({
          email: email,
          password: "1234",
          resetCode: resetCode
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          return done();
        });
    }); */
    describe("Get data of one user by his ID", function() {
      it("Get data successfully", function(done) {
        chai
          .request(app)
          .get("/api/user/" + email)
          .set("Content-type", "application/json")
          .send({})
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            return done();
          });
      });
    });
  });
});
