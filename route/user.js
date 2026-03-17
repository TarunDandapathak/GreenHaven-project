const express = require("express");
const router = express.Router();
const wrapAsync = require("../exceptionItems/wrapAsync.js");
const ExpressError = require('../exceptionItems/ExpressError.js');
const User = require("../models/userSchema.js");
const passport = require("passport");
const placeInfo = require("../models/placeInfo.js");
const { saveRedirectUrl } = require("../middleware.js");
const { signUp } = require("../controllers/users.js");
const userRoute = require("../controllers/users.js");



router.route("/signup")
    .get((req, res) => {
        res.render("places/signup.ejs")
    })
    .post(wrapAsync(userRoute.signUp));



router.route("/login")
    .get(userRoute.redirectLoginPage)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userRoute.login
    );


router.get("/logout", userRoute.logout);




module.exports = router;