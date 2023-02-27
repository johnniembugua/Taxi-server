const express = require("express");
const { createUser, otpLogin, verifyOTP, loginUser, verifyToken, updatePassword } = require("../controller/auth.ctl");
const auth = require("../middleware/auth");

const authRouter = express.Router();


authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.post("/otp-login", otpLogin);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/verify-token", verifyToken);
authRouter.put("/update-password", auth, updatePassword);

module.exports = authRouter;