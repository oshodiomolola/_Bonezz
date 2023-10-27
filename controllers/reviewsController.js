const { Reviews } = require('../Models/reviews')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const appError = require('../utils/errorHandler')

const writeReviews = async (req, res, next) => {
    try {
        const review = req.body
        if (!review.user) review.user = req.user.id
        if (!review.blog) review.blog = req.params.blogId
        const newReview = await Reviews.create(review)
        res.status(201).json({
            result: 'SUCCESSFUL',
            message: 'Thank you for your review!',
            newReview
        })
    } catch (err) {
        next(new appError(err, 500))
    }
}
const viewReviews = async (req, res, next) => {
    try {
        let filter = {}
        if (req.params.blogId) filter = { blog: req.params.blogId }
        const allReviews = await Reviews.find(filter)
        if (!allReviews) return next(new appError('empty reviews', 404))
        res.status(200).json({
            result: 'SUCCESSFUL',
            message: 'This are all the available reviews for this blog',
            size: allReviews.length,
            allReviews
        })
    } catch (err) {
        next(new appError(err, 500))
    }
}
const updateReviews = async (req, res, next) => {
    try {
        const review = await Reviews.findOne({ blog: req.params.blogId })
        if (review.user.id === req.user.id) {
            const update = req.body
            const updateReviews = await Reviews.
                findByIdAndUpdate(
                    req.params.reviewId,
                    update,
                    { new: true })
            if (!updateReviews) return next(new appError('no reviews for update', 404))
            res.status(200).json({
                result: 'SUCCESSFUL',
                message: 'Your reviews has been updated',
                updateReviews
            })
        }
        else{
            next(new appError('user is not permitted to carry action', 401))
           }
    } catch (err) {
        next(new appError(err, 500))
    }
}

const deleteReviews = async (req, res, next) => {
    try {
        const review = await Reviews.findOne({ blog: req.params.blogId })
        if (review.user.id === req.user.id) {
            const deleteReviews = await Reviews.findByIdAndDelete(req.params.reviewId)
            if (!deleteReviews) return next(new appError('No review has been deleted', 404))
            res.status(203).json({
                result: 'SUCCESSFUL',
                message: 'Reviews has been deleted from this blog',
            })
        }
        else{
            next(new appError('user is not permitted to carry action', 401))
           }
    } catch (err) {
        next(new appError(err, 500))
    }
}

module.exports = {
    writeReviews,
    viewReviews,
    updateReviews,
    deleteReviews
}