const router = require("express").Router();
const authContoller = require("../controller/authController");
const userController = require("../controller/userController");
const protectedAuth = require("../middleware/protectedAuth");

router.post("/signup", authContoller.signup);
router.post("/login", authContoller.login);

router.post("/forgetPassword", authContoller.forgetPassword);
router.patch("/resetPassword/:token", authContoller.resetPassword);

router.patch("/changePassword", protectedAuth, userController.changePassword);

module.exports = router;