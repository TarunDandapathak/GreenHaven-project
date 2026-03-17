require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./exceptionItems/ExpressError.js');
const review = require("./models/reviewSchema.js")
const placeRoute = require("./route/places.js");
const reviewRoute = require("./route/reviews.js");
const userRoute = require("./route/user.js");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/userSchema.js");
const profile = require("./route/profile.js");
const MongoStore = require("connect-mongo").default;



const MONGO_URL = process.env.MONGO_URL;
//connect mongodb 
main()
    .then(res => console.log("database connected"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});


store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



app.use(session(sessionOptions));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;

    next();
});

app.use(methodOverride("_method"));




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//for ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", 'ejs');
app.engine('ejs', ejsMate);

//for static file
app.use(express.static(path.join(__dirname, "./public")));





app.use("/places", placeRoute);
app.use("/places/:id/reviews", reviewRoute);
app.use("/", userRoute);
app.use("/", profile);


app.use((err, req, res, next) => {
    console.log(err);
    next(new ExpressError(404, "Page Not Found"));

});

app.use((err, req, res, next) => {
    console.log(err);
    let { status = 500, message = "Something was Wrong!!" } = err;
    res.render("places/error.ejs", { message });
});



app.listen(8080, () => {
    console.log("server was rinning on port 8080");
});