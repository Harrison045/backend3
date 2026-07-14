//import express
const express = require("express")
const createStudentController = require("../controllers/student")

//define router
const router = express.Router()

//create route 
router.post("/student", createStudentController)
//export router
module.exports = router