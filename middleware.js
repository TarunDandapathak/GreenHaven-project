const express = require("express")
const placeInfo = require("./models/placeInfo");
const Review = require("./models/reviewSchema");
const User = require("./models/userSchema");

isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        console.log(req.originalUrl);
        req.flash("success", "You must be logged in ");
        return res.redirect("/login");
    }

    next();
};



const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// prevUrl = (req, res, next) => {
//     req.session.redirectUrl = req.originalUrl;

//     console.log(req.originalUrl);
//     console.log(req.headers.referer)
//     next()
// }
checkRightUser = async (req, res, next) => {
    let { id } = req.params;
    let checkUser = await placeInfo.findById(id);
    if (!res.locals.currUser._id.equals(checkUser.owner._id)) {
        req.flash("error", "you are not owner of the post");
        return res.redirect(`http://localhost:8080/places/${id}`);
    }
    next()
}
isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    reviewId = reviewId.trim();
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not author of the review");
        return res.redirect(`http://localhost:8080/places/${id}`);
    }
    next()
}


module.exports = { saveRedirectUrl, isLoggedin, checkRightUser, isReviewAuthor };