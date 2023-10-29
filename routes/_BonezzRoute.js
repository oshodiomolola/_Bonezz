const express = require("express");
const _BonezzController = require("../controllers/_BonezzController");
const authController = require("../controllers/authController");
const reviewsRoute = require("./reviewsRoute");

const _BonezzRouter = express.Router();

// ACCESSABLE BY BOTH LOGGED IN AND NON LOGGED IN USERS
_BonezzRouter.get("/allBlog", _BonezzController.allBlog);
_BonezzRouter.get("/readBlog/:id", _BonezzController.readBlog);

// ONLY ACCESSABLE BY LOGGED IN USERS
_BonezzRouter.post(
  "/createblog",
  authController.isAuthenticated,
  _BonezzController.createBlog
);
_BonezzRouter.get(
  "/myBlog",
  authController.isAuthenticated,
  _BonezzController.myBlog
);
_BonezzRouter.put(
  "/updateBlog/:id",
  authController.isAuthenticated,
  _BonezzController.updateBlog
);
_BonezzRouter.delete(
  "/deleteBlog/:id",
  authController.isAuthenticated,
  _BonezzController.deleteBlog
);
_BonezzRouter.put(
  "/publishBlog/:id",
  authController.isAuthenticated,
  _BonezzController.publishBlog
);

_BonezzRouter.use("/:blogId", authController.isAuthenticated, reviewsRoute);

module.exports = _BonezzRouter;
