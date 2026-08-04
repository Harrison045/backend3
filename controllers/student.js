const { validationResult } = require("express-validator");
const StudentModel = require("../models/Student");

const registerStudent = async (req, res) => {
  //validation check
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(500).json({ message: errors.array()[0].msg });
  }

  try {
    //retrieve data from request body
    const { name, age, gender, location, phoneNumber } = req.body;
    
    //send the data to the database
    const student = await StudentModel({
      name,
      age,
      gender,
      location,
      phoneNumber,
    });

    //save the data to the database
    student
      .save()
      .then(() => {
        //send a response back to the client
        return res
          .status(201)
          .json({ message: "Student registered successfully", student });
      })
      .catch((error) => {
        res.status(500).json({ message: "Error registering student", error });
      });
  } catch (error) {
    console.log(error);
  }
};

const retrieveStudent = (req, res) => {
  const { id } = req.params;

  if (id) {
    StudentModel.findById(id)
      .then((student) => {
        return res.status(200).json({
          message: "Student data retrieved successfully",
          data: student,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    StudentModel.find()
      .then((student) => {
        res.status(200).json({
          message: "Student data retrieved successfully",
          data: student,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
};

const updateStudent = (req, res) => {
  const { id, name, age, gender, location, phoneNumber } = req.body;

  StudentModel.findById(id)
    .then((student) => {
      ((student.name = name),
        (student.age = age),
        (student.gender = gender),
        (student.location = location),
        (student.phoneNumber = phoneNumber));

      student.save().then(() => {
        res.status(200).json({
          message: "Student data updated successfully",
          data: student,
        });
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const deleteStudent = (req, res) => {
  const { id } = req.body;

  StudentModel.findByIdAndDelete(id)
    .then((deletedStudent) => {
      if (deletedStudent) {
        res.status(200).json({ message: "Student Deleted Successfuly" });
      } else {
        res.status(500).json({ message: "Student not found" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports = {
  registerStudent,
  retrieveStudent,
  updateStudent,
  deleteStudent,
};
