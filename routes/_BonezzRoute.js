const express = require('express');
const _BonezzController = require('../controllers/_BonezzController');


const _BonezzRouter = express.Router();


// ACCESSABLE BY BOTH LOGGED IN AND NON LOGGED IN USERS
router.get("/allBlog", blogController.allBlog)
router.get("/readBlog/:blogId", blogController.readBlog)


router.use(authController.isAuthenticated)
router.use('/:blogId', reviewRoute)
// ONLY ACCESSABLE BY LOGGED IN USERS
router.post("/createblog", blogController.createBlog)
router.get("/myBlog", blogController.myBlog)
router.patch("/updateBlog/:blogId", blogController.updateBlog)
router.delete("/deleteBlog/:blogId", blogController.deleteBlog)
router.patch("/publishBlog/:blogId", blogController.publishBlog)
