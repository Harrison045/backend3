const StudentModel = require("../models/Student");

const createStudentController = (req, res) => {
  //retrieving information from body
  const { name, age, gender, location } = req.body;

  //Send the imformation to the db through the model

  const student = new StudentModel({ name, age, gender, location });

  //Save it in db
  student
    .save()
    .then(() => {
      res.status(201).json({"data":student});
    })
    .catch((err) => console.log(err));
};


module.exports = createStudentController