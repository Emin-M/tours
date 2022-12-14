const router = require("express").Router({
    mergeParams: true
});
const reviewController = require("../controller/reviewController");
const protectedAuth = require("../middleware/protectedAuth");
const roleAccess = require("../middleware/roleAccess");

router.get("/", reviewController.getReviews);
router.post("/", protectedAuth, roleAccess("user"), reviewController.createReview);
router.delete(
    "/:id",
    protectedAuth,
    roleAccess("user"),
    reviewController.deleteReview
);

module.exports = router;