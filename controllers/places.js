

const placeInfo = require("../models/placeInfo");
const user = require("../models/userSchema")



module.exports.indexRoute = async (req, res) => {
    let allData = await placeInfo.find()
    res.render("places/index.ejs", { allData });

}

module.exports.renderForm = async (req, res) => {
    res.render('places/create.ejs');

}

module.exports.storeFormData = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let newPlace = new placeInfo(req.body);
    if (req.user) {
        newPlace.owner = req.user._id;
    }
    newPlace.image = { url, filename };
    await newPlace.save();
    req.flash("success", "New Data  Added");
    res.redirect("/places");


}

module.exports.renderShowPage = async (req, res) => {
    let { id } = req.params;
    let data = await placeInfo.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    res.render("places/show.ejs", { data });

}

module.exports.redirectEditPage = async (req, res) => {
    let { id } = req.params;
    let data = await placeInfo.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });;
    res.render("places/edit.ejs", { data });

}


module.exports.updateEditData = async (req, res) => {
    let { id } = req.params;
    let formData = req.body;
    let checkUser = await placeInfo.findById(id);
    let placeInformation = await placeInfo.findByIdAndUpdate(id, formData);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        placeInformation.image = { url, filename };
        await placeInformation.save();
    }
    req.flash("success", "Data Updated");
    console.log("res:-", res.locals.redirectUrl);
    res.redirect(`http://localhost:8080/places/${id}`);
}


module.exports.deletePlace = async (req, res) => {
    let { id } = req.params;
    await placeInfo.findByIdAndDelete(id);
    req.flash("success", "Data Deleted");
    const previousUrl = req.headers.referer ? new URL(req.headers.referer).pathname : "/places";
    console.log(previousUrl);

    if (previousUrl === "/profile") {
        res.redirect("/profile")
    } else {

        res.redirect("/places");
    }
}

module.exports.roomBook = async (req, res) => {

    const { id: placeId } = req.params;
    const { checkInDate, checkOutDate } = req.query;

    // Convert to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (isNaN(checkIn) || isNaN(checkOut)) {
        return res.status(400).send("Invalid date format");
    }
    if (checkOut <= checkIn) {
        return res.status(400).send("Check-out must be after check-in");
    }

    const usr = await user.findById(res.locals.currUser._id);
    const plc = await placeInfo.findById(placeId);
    if (!usr) return res.status(404).send("User not found");
    if (!plc) return res.status(404).send("Room information not found");

    const room = await placeInfo.findOne({
        _id: placeId,
        date: {
            $elemMatch: {
                checkIn: { $lt: checkOut },
                checkOut: { $gt: checkIn }
            }
        }
    });

    let deleteDatePlace = await placeInfo.updateMany(
        {},
        {
            $pull: {
                date: {
                    checkOut: { $lte: new Date() }
                }
            }
        }
    )

    let deleDataUser = await user.updateMany(
        {},
        {
            $pull: {
                bookingDate: {
                    checkOut: { $lte: new Date() }
                }
            }
        }
    )


    if (room) {
        req.flash("error", "Room already reserved for these dates");
        res.redirect(`/places/${placeId}`);

    } else {

        req.flash("success", "Room Available");



        usr.bookingDate.push({
            placeId: placeId,
            checkIn: checkIn,
            checkOut: checkOut
        });
        console.log(checkIn);
        console.log(checkOut);
        plc.date.push({
            checkIn: checkIn,
            checkOut: checkOut
        });
        await usr.save();
        await plc.save();
        const message = `Booking saved: ${checkIn.toDateString()} to ${checkOut.toDateString()}`;

        res.render("places/pay.ejs", { message });
    }
}


module.exports.addToCart = async (req, res) => {

    const id = req.params.id;

    if (!res.locals.currUser) {
        return res.redirect("/login");
    }

    const userId = res.locals.currUser._id;
    const usr = await user.findById(userId);

    const exists = usr.cart.some(item => item.place.equals(id));

    const previousUrl = req.headers.referer ? new URL(req.headers.referer).pathname : "/places";

    if (!exists) {
        // Add to cart
        usr.cart.push({ place: id });
        await usr.save();
    } else {
        // Remove from cart
        await user.findByIdAndUpdate(userId, {
            $pull: { cart: { place: id } }
        });

        // Redirect back to previous page
        return res.redirect(previousUrl);
    }

    // Default redirect after adding
    res.redirect("/places");

}

module.exports.searchOptions = async (req, res) => {
    let location = req.body.search;
    let MachData = await placeInfo.find({
        location: { $regex: location, $options: "i" }
    });

    let unMatchData = await placeInfo.find({
        location: { $not: { $regex: `^${location}$`, $options: "i" } }
    });
    let allData = [...MachData, ...unMatchData];
    res.render("places/index.ejs", { allData });
}






