"use strict";

const { expect } = require("chai");

const util = require("../../helper/util.js");

describe("helper.util", function() {
  describe("generateString", function() {
    it("Randon string default length", function() {
      const str = util.generateString();
      expect(str).to.exist;
      expect(str).to.be.an("string");
      expect(str).to.be.length(10);
    });

    it("Random string generate 28 chars", function() {
      const str = util.generateString(28);
      expect(str).to.exist;
      expect(str).to.be.an("string");
      expect(str).to.be.length(28);
    });
  });
});
