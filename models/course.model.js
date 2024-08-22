const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    }
})


module.exports = mongoose.model("Course", courseSchema);