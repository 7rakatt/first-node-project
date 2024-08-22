const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const httpStatustext = require("./utils/httpstatustxt");
require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
  console.log("Connected successfully to server");
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const coursesRouter = require("./routes/courses.rout");
const usersRouter = require("./routes/user.rout");

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: httpStatustext.ERROR,
    message: "this resource is not avilable",
  });
});

app.use((error, req, res, next) => {
 res.status(error.statusCode || 500).json({
   status: error.statusText || httpStatustext.ERROR,
   message: error.message,
   code: error.statusCode || 500,
   data: null,
 });
});

app.listen(process.env.PORT || 5001, () => {
  console.log("listening to port 5001");
});
