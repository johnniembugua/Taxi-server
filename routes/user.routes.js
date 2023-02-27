const express = require("express");
const { getAllUsers, getUser, deleteUser, updateUser, verifyUser, createAddress } = require("../controller/user.ctl");

const userRouter = express.Router();


userRouter.get("/", getAllUsers);
userRouter.post("/verify/:id", verifyUser);
userRouter.get("/:id", getUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:id", updateUser);
userRouter.post("/address", createAddress);



module.exports = userRouter;