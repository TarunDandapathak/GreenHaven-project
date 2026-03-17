const express = require("express");
const router = express.Router();
const { isLoggedin } = require("../middleware.js");
const user = require("../models/userSchema.js");
const place = require("../models/placeInfo.js");
const profileRoute = require("../controllers/profile.js");
const wrapAsync = require("../exceptionItems/wrapAsync.js");


router.get("/profile", isLoggedin,wrapAsync(profileRoute.profile));

module.exports = router;