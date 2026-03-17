const express = require("express");
const router = express.Router();
const wrapAsync = require("../exceptionItems/wrapAsync");
const ExpressError = require('../exceptionItems/ExpressError.js');
const { placeValidation, bookingSchema } = require("../schemaValidate.js");
const placeInfo = require("../models/placeInfo.js");
const User = require("./user.js");
const passport = require("passport");
const { isLoggedin, checkRightUser } = require("../middleware.js");
const placeRoute = require("../controllers/places.js");
const multer = require('multer');
const { storage } = require("../cloudinaryConfig.js");
const upload = multer({ storage });
const user = require("../models/userSchema.js");

const Razorpay = require('razorpay');
require("dotenv").config();
const { validateWebHookSignature } = require("razorpay/dist/utils/razorpay-utils");


const validatePlace = (req, res, next) => {
    let { error } = placeValidation.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateBooking = (req, res, next) => {

    const { error } = bookingSchema.validate(req.body);

    if (error) {
        const { id } = req.params;

        let errMsg = error.details.map(el => el.message).join(",");

        req.flash("error", errMsg);

        return res.redirect(`/places/${id}`);
    }

    next();
};



router.get("/:id/book", isLoggedin, validateBooking, wrapAsync(placeRoute.roomBook));

router.get("/:id/cart", isLoggedin, wrapAsync(placeRoute.addToCart));

//index routen7
router.get("/", wrapAsync(placeRoute.indexRoute));


router.route("/new")
    //render form for add items
    //create route
    .get(isLoggedin, wrapAsync(placeRoute.renderForm))
    //store form data into database
    .post(upload.single("image"),
        wrapAsync(placeRoute.storeFormData)
    );


//show in details
// show route
router.get("/:id", wrapAsync(placeRoute.renderShowPage));


router.route("/:id/edit")
    //edit route
    .get(isLoggedin, checkRightUser, wrapAsync(placeRoute.redirectEditPage))
    //update route
    .put(upload.single("image"), wrapAsync(placeRoute.updateEditData));


router.post("/search", wrapAsync(placeRoute.searchOptions));


router.delete("/:id/delete", isLoggedin, checkRightUser, wrapAsync(placeRoute.deletePlace));


module.exports = router;