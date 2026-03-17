const placeInfo=require("../models/placeInfo");
const reviews=require("../models/reviewSchema");

module.exports.showReviews = async (req, res) => {
  
    let { id } = req.params;
   
    let listening = await placeInfo.findById(id);
    let newReview = await new reviews(req.body.review);
    console.log(listening);
    console.log("new review object",newReview);
    newReview.author = res.locals.currUser;
    listening.reviews.push(newReview);
    await newReview.save();
    listening.save();
    res.redirect(`/places/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    reviewId = reviewId.trim();
    await placeInfo.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviews.findByIdAndDelete(reviewId);
    res.redirect(`/places/${id}`);

}