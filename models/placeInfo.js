const mongoose = require("mongoose");
const Reviews = require("./reviewSchema.js");
const { default: isEmail } = require("validator/lib/isEmail.js");
const { Schema } = mongoose;
const validator = require("validator")
const Review = require("./reviewSchema.js");
const { defaults } = require("joi");

// const review=require("./reviewSchema.js");
const placeSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,

    },
    location: {
        type: String,

    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'

        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
    date:
        [
            {
                checkIn: Date,
                checkOut: Date

            },
            
        ]



})


placeSchema.post("findOneAndDelete", async (places) => {
    if (places) {
        await Review.deleteMany({ _id: { $in: places.reviews } });
    }

});


module.exports = mongoose.model("placeInfo", placeSchema);
