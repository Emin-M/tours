const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");
const {
  asyncCatch
} = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");

//! Getting All Tours
exports.getAllTours = asyncCatch(async (req, res, next) => {
  //!MongoDb object
  const tours = new GlobalFilter(Tour.find(), req.query);
  tours.filter().sort().fields().paginate();

  const allData = await tours.query;

  res.json({
    success: true,
    length: allData.length,
    data: {
      tours: allData,
    },
  });
});

//! Getting Tour With "_id"
exports.getOneTour = asyncCatch(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findById(id)

  if (!tour) return next(new GlobalError("Invalid ID", 404));

  res.json({
    success: true,
    data: {
      tour
    }
  });
});

//! Posting Tour
exports.createTour = asyncCatch(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.json({
    success: true,
    data: {
      newTour,
    },
  });
});

//! Updating Tour With "_id"
exports.updateTour = asyncCatch(async (req, res, next) => {
  const id = req.params.id;

  //! updating tour
  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true
  });

  if (!updatedTour) return next(new GlobalError("Invalid ID", 404));

  res.json({
    success: true,
    data: updatedTour
  });
});

//! Deleting Tour
exports.deleteTour = asyncCatch(async (req, res, next) => {
  const id = req.params.id;

  //! updating tour
  const deletedTour = await Tour.findByIdAndRemove(id);
  if (!deletedTour) return next(new GlobalError("Invalid ID", 404));

  res.json({
    success: true,
    message: `tour with name: '${deletedTour.name}' deleted`
  });
});

//! Getting Statistic
exports.getStatictic = asyncCatch(async (req, res, next) => {
  const aggregateData = await Tour.aggregate([{
      $group: {
        _id: "$difficulty",
        tourSum: {
          $sum: 1
        },
        maxPrice: {
          $max: "$price"
        },
        minPrice: {
          $min: "$price"
        },
        averageRating: {
          $avg: "$ratingsAverage"
        }
      }
    },
    {
      $sort: {
        tourSum: -1
      }
    }
  ]);

  res.json({
    success: true,
    data: aggregateData
  });
});

//! Getting Monthly Plan
exports.getMonthlyPlan = asyncCatch(async (req, res, next) => {
  const year = req.params.year;

  const aggregateData = await Tour.aggregate([{
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      }
    },
    {
      $group: {
        _id: {
          $month: "$startDates",
        },
        sum: {
          $sum: 1
        },
        tours: {
          $push: "$name"
        },
        people: {
          $sum: "$maxGroupSize"
        }
      }
    }, {
      $addFields: {
        month: "$_id"
      }
    }, {
      $project: {
        _id: 0
      }
    }, {
      $sort: {
        sum: -1,
      },
    },
  ]);

  res.json({
    success: true,
    length: aggregateData.length,
    data: aggregateData
  })
});