const mongoose = require("mongoose");
const Tour = require("./tour");

//! Review schema
const reviewSchema = mongoose.Schema({
    content: {
        type: String
    },

    rating: {
        type: Number,
        required: [true, "Please provide rating for review"],
        min: 1,
        max: 5
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tour"
    }
});

reviewSchema.pre(/find/, function (next) {
    this.populate({
        path: "creator",
        select: "-password",
    });
    next();
});

reviewSchema.statics.getAverageRating = async function (tourId) {
    const data = await this.aggregate([{
            $match: {
                tour: tourId
            },
        },
        {
            $group: {
                _id: "$tour",
                ratingQuantity: {
                    $sum: 1
                },
                ratingAve: {
                    $avg: "$rating"
                },
            },
        },
    ]);

    if (data[0]) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: data[0].ratingAve,
            ratingsQuantity: data[0].ratingQuantity,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

reviewSchema.post("save", function (doc) {
    doc.constructor.getAverageRating(doc.tour);
});

reviewSchema.post(/^findOneAnd/, function (doc) {
    doc && doc.constructor.getAverageRating(doc.tour);
});


const Review = mongoose.model("review", reviewSchema);

module.exports = Review;