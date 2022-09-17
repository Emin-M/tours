const router = require("express").Router();
const tourController = require("../controller/tourController");
const top5Middleware = require("../middleware/top5");
const protectedAuth = require("../middleware/protectedAuth");

//! get requests
router.get("/", tourController.getAllTours);
router.get("/top-5", top5Middleware, tourController.getAllTours);
router.get("/statistic", protectedAuth, tourController.getStatictic);
router.get("/monthly-plan/:year", tourController.getMonthlyPlan);
router.get("/:id", tourController.getOneTour);

//! requests
router.post("/", tourController.createTour);
router.patch("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

module.exports = router;