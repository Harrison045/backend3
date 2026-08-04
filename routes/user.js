const express = require("express");
const { signUp, signIn, signOut } = require("../controllers/AuthController");
const { body } = require("express-validator");
const AuthModel = require("../models/Auth");

const router = express.Router();

router.post(
  "/signup",
  body("email")
    .notEmpty()
    .withMessage("Email must be filled")
    .isEmail()
    .custom((value, { req }) => {
      return AuthModel.findOne({ email: value }).then((authemail) => {
        if (authemail) {
          return Promise.reject("Email is already taken");
        }
      });
    }),
  signUp,
);

router.post("/signin", signIn);
router.post("/logout", signOut)

module.exports = router;
