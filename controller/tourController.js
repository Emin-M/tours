const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");

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

exports.getOneTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.find({
      _id: id
    })

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