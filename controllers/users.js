const User=require("../models/userSchema");
const passport=require("passport");


module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let registerUser = new User({
            username, email
        });
        let regUser = await User.register(registerUser, password);
        req.login(regUser, (err) => {
            if (err) { return next(err) };
            req.flash("success", "Welcome to GreenHaven");
            res.redirect("/places");

        });
    } catch (err) {
        req.flash("success", err.message);
        res.redirect("/signup");
    }
}

module.exports.redirectLoginPage = (req, res) => {
    res.render("places/login.ejs");
}

module.exports.login = (req, res) => {
    req.flash("success", "Successfully Logged in");
    res.redirect(res.locals.redirectUrl || "/places");
}

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You logged out");
        res.redirect("/places");
    });
}