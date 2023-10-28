const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { _Bonezz } = require('../Models/_Bonezz');

const reviewsSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'blog'
    },
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    timestamp: { type: Date, default: Date.now }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
reviewsSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        localField: 'id',
        foreignField: '_id',
        model: 'User',
        select: 'firstname photo id '
    });
    next();
})

reviewsSchema.statics.calcAvgRating = async function (blogId) {
    const stats = await this.aggregate([
        {
            $match: { blog: blogId }
        },
        {
            $group: {
                _id: '$blog',
                numOfRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    await _Bonezz.findByIdAndUpdate(blogId, {
        numOfRating: stats[0].numOfRating,
        ratingAvg: stats[0].avgRating
    }, { new: true })
}

reviewsSchema.post('save', function () {
    this.constructor.calcAvgRating(this.blog);

})

const Reviews = mongoose.model('Reviews', reviewsSchema)
module.exports = { Reviews }