const express = require('express');
const reviewsController = require('../Controllers/reviewsController');


const router = express.Router({mergeParams:true});


router.post("/makeReviews", reviewsController.writeReviews);
router.get("/allReviews", reviewsController.viewReviews);
router.patch("/:reviewId", reviewsController.updateReviews);
router.delete("/:reviewId", reviewsController.deleteReviews);



module.exports = reviewsRouter