require("dotenv").config();
const jwt = require('jsonwebtoken');
const { User } = require('../Models/users');
const appError = require('../utils/errorHandler');
const sendMail = require('../utils/email');


const isLoggedIn = async (req, res, next) => {
  try {
      if (!req.cookies.jwt) {
          return next(new appError('kindly login or sign up', 401))
      }
      else if (req.cookies.jwt) {
          const decodedToken = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
          const date = new Date
          const time = parseInt(date.getTime() / 1000)
          const user = await User.findById(decodedToken.id)

          if (user && decodedToken.iat < time)
              res.locals.user = user
          return next()
      }

      next()

  } catch (error) {
      next(new appError(err, 500))
  }

};


const isAuthenticated = async (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;
      let token;

      if (authHeader) {
          token = authHeader.split(' ')[1];
      } else if (req.cookies) {
          token = req.cookies.jwt;
      }

      if (!token) {
          return res.status(401).json({ message: 'Unauthorized' });
      }

      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
      const date = new Date();
      const time = parseInt(date.getTime() / 1000);
      const user = await User.findById(decodedToken.id);

      if (user && decodedToken.iat < time) {
          req.user = user;
          res.locals.user = user;
          next();
      } else {
          return res.status(401).json({ message: 'Unauthorized' });
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { isLoggedIn, isAuthenticated }