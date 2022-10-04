const router = require("express").Router();
const reviewController = require("../controller/reviewController");
const protectedAuth = require("../middleware/protectedAuth");
const roleAccess = require("../middleware/roleAccess");

router.get("/:tourId", reviewController.getReviews);
router.post("/:tourId", protectedAuth, roleAccess("user"), reviewController.createReview);

module.exports = router;