const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
module.exports = (req, res, next) => {
  const write_list = ["/api/auth/login", "/api/auth/register"];

  const origin = req.originalUrl;
  if (write_list.find((path) => origin.includes(path))) {
    next();
    return;
  } else {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ massage: "Unauthorized" });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json("Token không hợp lệ!");
        return;
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};
