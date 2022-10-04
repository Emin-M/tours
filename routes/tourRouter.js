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
router.get("/monthly-plan/:year", protectedAuth, roleAccess("guide", "lead-guide"), tourController.getMonthlyPlan);
router.get("/:id", tourController.getOneTour);

//! protected routes
router.use(protectedAuth);
router.use(roleAccess("admin"));

router.post("/", tourController.createTour);
router.patch("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

module.exports = router;