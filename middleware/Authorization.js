const jwt = require("jsonwebtoken");
require("dotenv").config()

const Authorization = (req, res, next) => {
  // // Get the Authorization header
  // const authorizationHeader = req.get("Authorization");
  // if (!authorizationHeader) {
  //   throw new Error("Not authenticated, please sign in");
  // }

  // //Extract the token from Authorization header
  // const token = authorizationHeader.split(" ")[1];

  const token = req.cookies.usertoken

  //Verify the token using the secret key
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET,
  );

  req.user = decodedToken

  if (!decodedToken) {
    throw new Error("Invalid token, please try again");
  }
  next();
};

module.exports = Authorization;
