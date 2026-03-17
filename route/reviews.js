const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require("../models/reviewSchema.js");
const { placeValidation, reviewSchema } = require("../schemaValidate.js");
const wrapAsync = require("../exceptionItems/wrapAsync.js");
const ExpressError = require('../exceptionItems/ExpressError.js');
const placeInfo = require("../models/placeInfo.js");
const reviews = require("../models/reviewSchema.js");
const methodOverride = require("method-override");
const { isLoggedin, saveRedirectUrl,isReviewAuthor } = require("../middleware.js");
const { showReviews, deleteReview } = require("../controllers/reviews.js");
const reviewRoute=require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


// review.ejs

router.post("/", isLoggedin, saveRedirectUrl, wrapAsync(reviewRoute.showReviews));

router.delete("/:reviewId",isLoggedin ,wrapAsync(reviewRoute.deleteReview));
module.exports = router;