const User = require("../models/user.model");
const httpStatustext = require("../utils/httpstatustxt");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");
const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/generateJWT");



const getAllusers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, {'__v':false,'password':false}).limit(limit).skip(skip);
  res.json({ status: httpStatustext.SUCCESS, data: { users } });
});

const getSinglecourse = asyncWrapper(
  async(req,res,next) => {
  const user = await User.findById(req.params.userId, {'__v':false,'password':false});
    if (!user) {
      const error = appError.creat("user not found", 404, httpStatustext.FAIL);
      return next(error);
  }
  return res.json({ status: httpStatustext.SUCCESS, data: { user } });
  });


const deleteUser = asyncWrapper(async (req, res) => {
  const userId = req.params.userId;
  await User.deleteOne({ _id: userId });
  res.status(200).json({ status: httpStatustext.SUCCESS, data: null });
});

const register = asyncWrapper(async (req, res,next) => {
  const { firstName, lastName, email, password ,role} = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.creat("user is already exsist", 400, httpStatustext.FAIL);
    return next(error);
  }
  const hashedPass = await bcrypt.hash(password, 10)
  
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPass,
    role,
    avatar: req.file.filename
  });
  const token =await generateJWT({ email: newUser.email, id: newUser._id ,role:newUser.role})
  newUser.token = token;
  await newUser.save();
res.status(201).json({ status: httpStatustext.SUCCESS, data: { user: newUser } });
})



const login = asyncWrapper(async (req, res,next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.creat(
      "email and password are require",
      400,
      httpStatustext.FAIL
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
     const error = appError.creat("user is not exsist", 500, httpStatustext.ERROR);
     return next(error);
  }
  const matchedPass = await bcrypt.compare(password, user.password);
  if (user && matchedPass) {
    const token =await generateJWT({ email: user.email, id: user._id ,role: user.role});
    user.token = token;
    return res.json({ status: httpStatustext.SUCCESS, data: { token} });
  } else {
    const error = appError.creat(
      "somthing wrong",
      500,
      httpStatustext.ERROR
    );
    return next(error);
  }
})
module.exports = {
  getAllusers,
  register,
  login,
  getSinglecourse,
  deleteUser,
};
