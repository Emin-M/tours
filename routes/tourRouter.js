const router = require("express").Router();
const tourController = require("../controller/tourController");
const top5Middleware = require("../middleware/top5");
const protectedAuth = require("../middleware/protectedAuth");
const roleAccess = require("../middleware/roleAccess");
const reviewRouter = require("./reviewRouter");

//! merged routes
router.use("/:tourId/review", reviewRouter);

//! get requests
router.get("/", tourController.getAllTours);
router.get("/top-5", top5Middleware, tourController.getAllTours);
router.get("/statistic", protectedAuth, tourController.getStatictic);
router.get("/monthly-plan/:year", tourController.getMonthlyPlan);
router.get("/:id", tourController.getOneTour);

//! requests
router.post("/", protectedAuth, tourController.createTour);
router.patch("/:id", protectedAuth, roleAccess("admin", "guide"), tourController.updateTour);
router.delete("/:id", protectedAuth, roleAccess("admin"), tourController.deleteTour);

module.exports = router;