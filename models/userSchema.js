const mongoose = require("mongoose");
const { checkout } = require("../route/user");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    bookingDate: [
        {
            placeId: { type: mongoose.Schema.Types.ObjectId, ref: "placeInfo" },
            checkIn: Date,
            checkOut: Date,
        },
    ],
    cart: [
        {
            place: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "placeInfo"
            },
            _id: false
        }
    ]


});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

