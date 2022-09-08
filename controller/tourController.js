const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");

//! Getting All Tours
exports.getAllTours = async (req, res) => {
  //!MongoDb object
  const tours = new GlobalFilter(Tour.find(), req.query);
  tours.filter().sort().fields().paginate();

  try {
    const allData = await tours.query;

    res.json({
      success: true,
      length: allData.length,
      data: {
        tours: allData,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

//! Getting Tour With "_id"
exports.getOneTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id)

    if (!tour) return res.send({
      success: false,
      message: "Invalid ID"
    });

    res.json({
      success: true,
      data: {
        tour
      }
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

//! Posting Tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.json({
      success: true,
      data: {
        newTour,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

//! Updating Tour With "_id"
exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;

    //! updating product
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (!updatedTour) {
      return res.status(404).json({
        success: false,
        message: "Invalid ID"
      });
    }

    res.json({
      success: true,
      data: updatedTour
    })

  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

//! Deleting Tour
exports.deleteTour = async (req, res) => {
  try {
    const id = req.params.id;

    //! updating product
    const deletedTour = await Tour.findByIdAndRemove(id);
    if (!deletedTour) return res.status(404).json({
      success: false,
      message: "Invalid ID"
    });

    res.json({
      success: true,
      message: `tour with name: '${deletedTour.name}' deleted`
    });

  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

//! Getting Statistic
exports.getStatictic = async (req, res) => {
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
};

exports.getMonthlyPlan = async (req, res) => {
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
};