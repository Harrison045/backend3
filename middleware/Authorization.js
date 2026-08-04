//import jsonwebtoken
const jwt = require("jsonwebtoken");
require("dotenv").config()

const Authorization = (req, res, next) => {
  try {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({ error: 'No token provided' });
    }

    //verify token with jwt

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    req.user = decodedToken

    if (!decodedToken) {
      throw new Error("Unauthorized");
    }
    next()
  } catch (error) {
    console.log(error);
  }
};

module.exports = Authorization;
