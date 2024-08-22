const { validationResult } = require("express-validator");
const Course = require("../models/course.model");
const httpStatustext = require("../utils/httpstatustxt");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");



const getAllcourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, {'__v': false}).limit(limit).skip(skip);
  res.json({ status: "success", data: { courses } });
});

const getSinglecourse = asyncWrapper(
  async(req,res,next) => {
  const course = await Course.findById(req.params.courseId);
    if (!course) {
      const error = appError.creat("course not found", 404, httpStatustext.FAIL);
      return next(error);
  }
  return res.json({ status: httpStatustext.SUCCESS, data: { course } });
});

const addCourse = asyncWrapper(async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.creat(errors.array(), 400, httpStatustext.FAIL);
    return next(error);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ status: httpStatustext.SUCCESS, data: { newCourse } });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  await Course.deleteOne({ _id: courseId });
  res.status(200).json({ status: httpStatustext.SUCCESS, data: null });
});

const editCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
    const course = await Course.updateOne(
      { _id: courseId },
      { $set: { ...req.body } }
    );
    return res
      .status(200)
      .json({ status: httpStatustext.SUCCESS, data: { course } });
});

const deleteAll = asyncWrapper(async (req, res) => {
  await Course.deleteMany();
  res.status(200).json({ status: httpStatustext.SUCCESS, data: null });
});

module.exports = {
  getAllcourses,
  getSinglecourse,
  addCourse,
  deleteCourse,
  editCourse,
  deleteAll,
};
