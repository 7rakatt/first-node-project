const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const userRoles = require("../utils/user.role");
const allowedTo = require("../middleware/allowedTo");
const appError = require("../utils/appError");
const multer = require("multer");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  }
})
const fileFilter = (req,file,cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === 'image') {
    return cb(null,true)
  } else {
    return cb(appError.creat('file must be image',400), false);
  }
}

const upload = multer({
  storage: diskStorage,
  fileFilter
});


const Router = express.Router();
const usersController = require('../controllers/users.controller');
Router.route("/").get(verifyToken,usersController.getAllusers);
Router.route("/register").post(upload.single('avatar'),usersController.register)
Router.route("/login").post(usersController.login);
Router.route("/:userId")
  .get(verifyToken, usersController.getSinglecourse)
  .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANGER),usersController.deleteUser);
  

module.exports = Router;
