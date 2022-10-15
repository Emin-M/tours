const router = require("express").Router();
const authContoller = require("../controller/authController");
const userController = require("../controller/userController");
const protectedAuth = require("../middleware/protectedAuth");
const {
    getMe
} = require("../utils/factory");

router.post("/signup", authContoller.signup);
router.post("/login", authContoller.login);
router.post("/forgetPassword", authContoller.forgetPassword);
router.patch("/resetPassword/:token", authContoller.resetPassword);

//! protected routes
router.use(protectedAuth);
router.get("/me", getMe, userController.getUser);
router.patch("/changePassword", userController.changePassword);
router.patch("/", userController.updateUser);
router.delete("/me", userController.deleteMe);

module.exports = router;