const {
  registerStudent,
  retrieveStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student");

//Import express
const express = require("express");
const { body } = require("express-validator");
const StudentModel = require("../models/Student");
const Authorization = require("../middleware/Authorization");

//Define router
const router = express.Router();

//Create student route
router.post(
  "/register",
  Authorization,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name field must not be empty")
      .isLength(7)
      .withMessage("Minimum length is 7"),
    body("phoneNumber")
      .notEmpty()
      .withMessage("Number field must not be empty")
      .isMobilePhone("en-GH")
      .withMessage("Enter correct phone number")
      .custom((value, { req }) => {
        return StudentModel.findOne({ phoneNumber: value }).then((student) => {
          if (student) {
            return Promise.reject("Number already taken, please try again");
          }
        });
      }),
  ],
  registerStudent,
);
router.get("/student", retrieveStudent);
router.get("/student/:id", retrieveStudent);
router.put("/student", updateStudent);
router.delete("/student", deleteStudent);

//export student route
module.exports = router;
