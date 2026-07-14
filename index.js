const express = require("express");
const studentRoute = require("./routes/student");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const server = express();
PORT = 3004;

//body parser
server.use(express.json());

//call route
server.use(studentRoute);

//mongodb connection
mongoose
  .connect(process.env.mongodb_url)
  .then(() => {
    server.listen(PORT, "localhost", () =>
      console.log(`Server is live on port http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.log(err));
