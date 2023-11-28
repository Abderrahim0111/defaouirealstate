const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        res.json({error: err});
      } else {
        next();
      }
    });
  } else {
    res.json({ error: "not authanticated" });
  }
};

const checkIfUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        req.user = null
        next();
      } else {
        const curentUser = await User.findOne({_id: decoded.id});
        req.user = curentUser
        next()
      }
    });
  }else{
    req.user = null
    next()
  }
};

module.exports = { requireAuth, checkIfUser };
