const express = require("express");
const studentRoute = require("./routes/student");
const UserAuth = require("./routes/user")
const { default: mongoose } = require("mongoose");
const dns = require("dns");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Use a reliable public DNS resolver so the mongodb+srv SRV lookup works
// (the system default resolver here is a link-local IPv6 address c-ares refuses)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const server = express();
PORT = process.env.PORT || 3000;

//body parser
server.use(express.json());
//cookie parser
server.use(cookieParser())

//routes
//student route
server.use(studentRoute)
//auth route
server.use(UserAuth)
//mongodb connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    server.listen(PORT, "localhost", () =>
      console.log(`Server is live on port http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.log(err));
