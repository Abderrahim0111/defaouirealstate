const { validationResult } = require("express-validator");
const User = require("../models/userSchema");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Listing = require("../models/listingSchema");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const register = async (req, res) => {
  try {
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      return res.json({ error: "Password must be at least 8 characters with 1 upper case letter and 1 number" });
    }
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("jwt", token, { 
        httpOnly: true, 
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds 
        secure: true, // Set the secure attribute
        sameSite: 'none' // Allow cross-site cookies
      });
      res.json(user);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.json({ error: "user not found" });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.json({ error: "incorrect password" });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("jwt", token, { 
          httpOnly: true, 
          maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds 
          secure: true, // Set the secure attribute
          sameSite: 'none' // Allow cross-site cookies
        });
        res.json(user);
      }
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

const google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("jwt", token, { httpOnly: true });
      res.json(user);
    } else {
      const generatePassword = Math.random().toString(36).slice(-8);
      const newUser = await User.create({
        username: req.body.name,
        email: req.body.email,
        password: generatePassword,
        avatar: req.body.photo,
      });

      if (newUser) {
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.cookie("jwt", token, { 
          httpOnly: true, 
          maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds 
          secure: true, // Set the secure attribute
          sameSite: 'none' // Allow cross-site cookies
        });
        res.json(newUser);
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

const update_profile = async (req, res) => {
  let img_url = "";
  if (req.file) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(req.file.path, (error, result) => {
          if (result) {
            img_url = result.secure_url;
            resolve(result);
          } else {
            reject(error);
          }
        });
      });
    } catch (error) {
      res.json({error: error});
    }
  }

  const { userData } = req.body;
  const parsedUserData = JSON.parse(userData);

  if(parsedUserData.password){
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(parsedUserData.password, salt)
    parsedUserData.password = hashedPass
  }

  
  if (req.cookies.jwt) {
    var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: decoded.id },
      {
        $set: {
          username: parsedUserData.username,
          email: parsedUserData.email,
          password: parsedUserData.password,
          avatar: img_url,
        },
      },
      { new: true }
    );
    res.json(updatedUser);
  }else{
    res.json({error: 'error'})
  }
};

const delete_user = async (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  try {
    await User.deleteOne({ _id: decoded.id });
    res.clearCookie("jwt");
    res.json({ message: "user deleted" });
  } catch (error) {
    res.json({ error: error });
  }
};

const sign_out = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.json({ message: "user loged out" });
  } catch (error) {
    res.json({ error: error });
  }
};

const getUserListings = async (req, res) => {
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const listings = await Listing.find({ userRef: decoded.id });
    res.json(listings);
  } catch (error) {
    res.json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.json(user);
    console.log(user)
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  register,
  login,
  google,
  update_profile,
  delete_user,
  sign_out,
  getUserListings,
  getUser,
};
