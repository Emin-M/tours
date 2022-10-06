const Review = require("../model/review");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const GlobalError = require("../utils/GlobalFilter");
const {
    deleteOne
} = require("../utils/factory");

exports.getReviews = asyncCatch(async (req, res, next) => {
    const reviews = await Review.find({
        tour: req.params.tourId
    });

    res.status(200).json({
        success: true,
        reviews,
        length: reviews.length
    });
});

exports.createReview = asyncCatch(async (req, res, next) => {
    const review = await Review.create({
        content: req.body.content,
        rating: req.body.rating,
        creator: req.user._id,
        tour: req.params.tourId
    });

    res.status(200).json({
        success: true,
        review: {
            _id: review._id,
            content: review.content,
            rating: review.rating
        }
    });
});

exports.deleteReview = deleteOne(Review);