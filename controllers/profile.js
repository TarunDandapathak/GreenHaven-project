const user = require("../models/userSchema");
const place = require("../models/placeInfo");

module.exports.profile = async (req, res) => {
    userId = res.locals.currUser._id;
    const usr = await user.findById(userId).populate("cart.place");
    let plc = await place.find({ owner: userId });
    res.render("places/myProfile.ejs", { datas: usr.cart, plc });
}