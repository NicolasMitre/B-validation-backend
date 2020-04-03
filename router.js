const express = require("express");
const router = express.Router();
const auth = require("./middlewares/auth").auth;
const validate = require("./middlewares/validator").validate;

router.get(
  "/api/",
  auth,
  validate,
  require("./entity/user/controller").getLoggedUser
);

router.post(
  "/api/logout",
  auth,
  validate,
  require("./entity/login/controller").logout
);

router.put(
  "/api/user/",
  auth,
  validate,
  require("./entity/user/controller").changePassword
);

router.post("/api/recovery", require("./entity/user/controller").sendEmail);
router.put(
  "/api/recovered",
  require("./entity/user/controller").passwordRecovered
);

router.post("/api/login", require("./entity/login/controller").login);
router.post("/api/register", require("./entity/register/controller").register);
router.get("/api/user/:username", require("./entity/user/controller").users);

module.exports = router;
