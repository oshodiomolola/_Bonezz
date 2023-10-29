const express = require('express');
const controller = require('../Controllers/usersController');
const authController = require("../Controllers/authController")

const userRouter = express.Router();

userRouter.use(authController.isAuthenticated);
userRouter.delete("/delete", controller.deleteAccount);
userRouter.patch("/updatePassword", controller.updateProfile);
userRouter.post("/forgotPassword", controller.forgetPassword);
userRouter.patch("/resetPassword/:token", controller.resetPassword);

module.exports = userRouter







userRouter.use(authController.isAuthenticated)
