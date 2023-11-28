const express = require("express");
const { register, login, google, update_profile, delete_user, sign_out, getUserListings, getUser } = require("../controllers/userControllers");
const { check } = require("express-validator");
const multer = require("multer");
const upload = multer({ storage: multer.diskStorage({}) });
const router = express.Router();




router.post(
  "/register",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  register
);
router.post("/login", login);
router.post("/google", google);
router.post("/update-profile", upload.single("avatar"), update_profile);
router.delete('/delete-user', delete_user)
router.get('/sign-out', sign_out)
router.get('/listings', getUserListings)
router.get('/:id', getUser)

module.exports = router;
