const mongoose = require("mongoose");
const shortId = require('shortid');

const schema = mongoose.Schema;
const appError = require("../utils/errorHandler");

const _BonezzSchema = new schema(
  {
    _id: {
      type: String,
      default: shortId.generate,
      autoIncrement: true,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Please provide book name"],
      toLowerCase: true,
      Required: true
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      ref: "Users"
    },
    readCount: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: Number,
    },
    bodyContent: {
      type: String,
      required: true
    },
    tags: {
      type: String,
      toLowerCase: true,
      required: true
    },
    state: {
      type: String,
      default: "draft",
      enum: ["draft", "published"],
    },
    ratingAvg: {
      type: Number,
      default: 3.5,
      set: (val) => Math.round(val * 10) / 10,
    },
    numOfRating: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
_BonezzSchema.methods.calReadTime = function (content) {
  if (typeof content !== "string" || content.trim() === "") {
    return 0;
  }
  let wpm = 250;
  const word = content.split(/\s+/);
  const wordCount = word.length;
  const readTime = wordCount / wpm;
  return Math.ceil(readTime);
};

_BonezzSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    localField: "id",
    foreignField: "_id",
    model: "User",
    select: "firstname id",
  });
  next();
});
_BonezzSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "blog",
  localField: "_id",
});

const _Bonezz = mongoose.model("blog", _BonezzSchema);
module.exports = { _Bonezz };
