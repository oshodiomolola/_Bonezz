const { _Bonezz } = require("../models/_Bonezz");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const appError = require("../utils/errorHandler");
const sendMail = require("../utils/email");
const _BonezzSearch = require("../utils/query");

const createBlog = async (req, res, next) => {
  try {
    const blogPost = req.body;
    blogPost.author = req.user.id;
    const newBlog = await _Bonezz.create(blogPost);
    newBlog.readingTime = newBlog.calReadTime(blogPost.bodyContent);
    if (!newBlog)
      return next(new appError("this blog post was not created", 400));
    res.status(201).json({
      result: "SUCCESS",
      message: "A new blog has been posted",
      newBlog,
    });
  } catch (err) {
    next(new appError(err, 500));
  }
};

const allBlog = async (req, res, next) => {
  try {
    const findBlog = new _BonezzSearch(req, res);
    const blogs = findBlog.search();
    if (!blogs || blogs.size === 0) {
      next(new appError("blog not found", 404));
    }
  } catch (err) {
    next(new appError(err, 500));
  }
};

const myBlog = (req, res, next) => {
  try {
    const findBlog = new _BonezzSearch(req, res);
    const blogs = findBlog.myBlog();
    if (!blogs || blogs.size === 0) {
      next(new appError("blog not found", 404));
    }
  } catch (err) {
    next(new appError(err, 500));
  }
};

const updateBlog = async (req, res, next) => {
  if (!req.user) {
    next(new appError("You are not authorized. Kindly sign up or login"));
  } else {
    if (!req.user) {
      return next(
        new appError("You are not authorized. Kindly sign up or login")
      );
    }

    try {
      const blog = await _Bonezz.findById(req.params.blogId);
      if (!blog) return next(new appError("this blog is not found", 404));

      if (blog.author.id === req.user.id) {
        const { title, description, bodyContent, tags } = req.body;
        const updates = {};

        if (title) {
          updates.title = title;
        }
        if (description) {
          updates.description = description;
        }
        if (bodyContent) {
          updates.bodyContent = bodyContent;
        }
        if (tags) {
          updates.tags = tags;
        }

        const updatedBlog = await _Bonezz.updateOne(
          { _id: req.params.blogId },
          updates
        );

        res.status(200).json({
          result: "SUCCESS",
          message: "Your blog has been updated successfully",
          updatedBlog,
        });
      } else {
        next(new appError("You are not authorized to update this blog", 403));
      }
    } catch (err) {
      next(new appError(err, 500));
    }
  }
};
const deleteBlog = async (req, res, next) => {
  const blog = await _Bonezz.findById(req.params.blogId);
  if (!blog) return next(new appError("this blog is not found", 404));
  if (blog.author.id === req.user.id) {
    const deletedBlog = await _Bonezz.deleteOne({ _id: req.params.blogId });
    res.status(203).json({
      result: "AWWWWNNNNN",
      message: "Blog has been deleted successfully. Write some more!!",
      deletedBlog,
    });
  } else {
    next(new appError("You are not authorized to delete this blog", 403));
  }
};

const publishBlog = async (req, res, next) => {
  try {
    const blog = await _Bonezz.findById(req.params.blogId);
    if (!blog) return next(new appError("this blog is not found", 404));
    if (blog.author.id === req.user.id) {
      blog.state = "published";
      blog.save();
      res.status(200).json({
        result: "SUCCESS",
        message: "Blog has been published successfully",
        blog,
      });
    } else {
      next(new appError("You are not authorized to publish this blog", 403));
    }
  } catch (err) {
    next(new appError(err, 500));
  }
};

const readBlog = async (req, res, next) => {
  try {
    const blog = await _Bonezz.findById(req.params.blogId).populate("reviews");
    if (!blog) return next(new appError("this blog is not found", 404));
    else {
      blog.readCount = (blog.readCount || 0) + 1;
      await blog.save();
      res.status(200).json({
        result: "SUCCESS",
        message: "Thank you for reading this article",
        blog,
      });
    }
  } catch (err) {
    next(new appError(err, 500));
  }
};

module.exports = {
  createBlog,
  allBlog,
  myBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  readBlog,
};
