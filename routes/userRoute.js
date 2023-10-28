const express = require('express');
const controller = require('../Controllers/usersController')

const userRouter = express.Router()

userRouter.post("/signup", controller.signUp);
userRouter.post("/login", controller.login);
userRouter.put("/update_profile/:id", controller.updateProfile);
userRouter.delete('/delete_account/:id', controller.deleteAccount);
userRouter.post("/logout", controller.logout);

module.exports = userRouter