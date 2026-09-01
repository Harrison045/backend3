const { validationResult } = require("express-validator");
const AuthModel = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const signUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(500).json(errors.array()[0].msg);
  }

  //get the user data from the req.body
  const { name, email, password } = req.body;

  try {
    //hash password
    await bcrypt
      .hash(password, 9)
      .then((hashedpassword) => {
        //Send user data to the database
        const user = AuthModel({ name, email, password: hashedpassword });

        const token = jwt.sign(
          { name: user.name, id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );

        user
          .save()
          .then(() => {
            res.cookie("usertoken", token, {
              httpOnly: true,
              secure: false,
              sameSite: "none",
            });
            res.status(201).json({
              message: "User account created successfully",
              data: user,
            });
          })
          .catch((err) => {
            return res.status(500).json("Failed to create user account");
          });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (req, res) => {
  // email and password for req.body
  const { email, password } = req.body;

  // find the user with email
  AuthModel.findOne({ email }) //b
    .then((person) => {
      if (person) {
        return bcrypt
          .compare(password, person.password)
          .then((result) => {
            if (result) {
              return res
                .status(200)
                .json({ message: "user signed in successfully", data: person });
            }
            return res
              .status(500)
              .json({ message: "Email and password combination is incorrect" });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Failed to sign in. Please try again later" });
          });
      }
      return res.status(500).json({ message: "User not found" });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Server error. Please try again later" });
    });
};

const signOut = (req, res) => {
  res.clearCookie("usertoken");
  res.status(200).json("user logged out successfully");
};

module.exports = { signUp, signIn, signOut };
