const mongoose = require("mongoose");
const { Schema } = mongoose;


const reviewSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String,
        minlength: 1,
        maxlength: 100
    },
    rating: {
        type: String,
        max: 5,
        min: 1
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
});



module.exports = mongoose.model("Review", reviewSchema);
