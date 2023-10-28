const express = require('express');
const reviewsController = require('../Controllers/reviewsController');


const reviewsRouter = express.Router({mergeParams:true});


reviewsRouter.post("/makeReviews", reviewsController.writeReviews);
reviewsRouter.get("/allReviews", reviewsController.viewReviews);
reviewsRouter.patch("/:reviewId", reviewsController.updateReviews);
reviewsRouter.delete("/:reviewId", reviewsController.deleteReviews);



module.exports = reviewsRouter