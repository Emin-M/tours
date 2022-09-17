const router = require("express").Router();
const authContoller = require("../controller/authController");

router.post("/signup", authContoller.signup);
router.post("/login", authContoller.login);

module.exports = router;