const express = require('express');
const { body } = require("express-validator");
const coursesController = require("../controllers/course.controller");
const Router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/user.role');



Router.route('/').get(coursesController.getAllcourses).post(
  [
    body("title")
      .notEmpty()
      .withMessage("title is require")
      .isLength({ min: 2 })
      .withMessage("minimum length is 2"),
    body("price").notEmpty().withMessage("price is require"),
  ],
  coursesController.addCourse
).delete(coursesController.deleteAll)
Router.route("/:courseId")
  .get(coursesController.getSinglecourse)
  .patch(coursesController.editCourse)
  .delete(allowedTo(userRoles.ADMIN,userRoles.MANGER),coursesController.deleteCourse);

module.exports = Router;