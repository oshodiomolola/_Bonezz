const { User } = require("../models/user");
const { jwtToken } = require("../utils/jwt");
const appError = require("../utils/errorHandler");

async function signUp(req, res, next) {
  try {
    const body = req.body;
    const newUser = await User.create(body);

    if (!newUser) {
      return next(new appError("Please fill in correct details", 400));
    }

    const token = await jwtToken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true });

    res.status(201).json({
      status: "SUCCESS",
      message: "Welcome to _Bonez",
      token,
      user: newUser,
    });
  } catch (err) {
    next(new appError(err, 500));
  }
}
async function login(req, res, next) {
  try {
    const loginDetails = req.body;
    // Confirm user existence
    const isValidUser = await User.findOne({ email: loginDetails.email });

    if (!isValidUser) {
      return next(new appError("This user is not found! Kindly sign up", 404));
    }

    // Compare user password
    const isValidPassword = await isValidUser.checkValidPassword(
      loginDetails.password
    );

    if (!isValidPassword) {
      return next(new appError("Invalid password or email", 401));
    }

    // Generate a token for the user
    const token = await jwtToken(isValidUser._id);

    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({
      result: "SUCCESSFUL",
      message: "You are logged in",
      token,
      user: isValidUser,
    });
  } catch (err) {
    next(new appError(err.message, 500));
  }
}

async function updateProfile(req, res, next) {
  try {
    const updateDetials = req.body;
    const updatedUser = User.findByIdAndUpdate(req.params.id, updateDetials, {
      new: true,
      runValidators: true,
    });
    if (updatedUser)
      res.status(200).json({
        result: "YAAAAAAAAH!",
        message: "Update made successfully!!!",
      });
  } catch (err) {
    next(new appError(err, 500));
  }
}
async function deleteAccount(req, res, next) {
  try {
    const deleteUser = await User.findByIdAndUpdate(req.params.id);
    if (deleteUser)
      res
        .status(200)
        .json({ result: "Awwwwwwwwwnnnn", message: "Please come back" });
  } catch (err) {
    next(new appError(err, 500));
  }
}

const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
  });

  return res.status(200).json({ message: "You are loggged out" });
};

const forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new appError("this user does not exist", 404));
    const resetToken = await user.createResetToken();

    console.log(resetToken);
    const emailMessage = `hey ${
      user.firstname
    } your passowrd reset code is :${resetToken}.\n
kindly click on the url to reset your password at ${req.protocol}://${req.get(
      "host"
    )}/resetPassowrd/${resetToken}`;
    await sendEmail(emailMessage, user);
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json({
        message: "your password reset token has been sent. check your mail box",
      });
  } catch (err) {
    new appError(err, 500);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = await crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetTimeExp: { $gt: Date.now() },
    });
    if (!user) return next(new appError("invalid token or expired token", 404));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetTimeExp = undefined;

    await user.save();
    const token = await jwtToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    res
      .status(200)
      .json({ message: "a new pasword has been set", token, user });
  } catch (err) {
    new appError(err, 500);
  }
};

const reactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "-password"
    );
    if (!user) next(new appError("this user does not exist", 404));
    user.active = true;
    const message = `Hey ${user.firstname}, we are excited to have you on board with us .\n kindly confirm your email.`;
    await sendEmail(message, user);
    await user.save();
    res
      .status(200)
      .json({
        message: `welcome back ${user.username}. your account has been re-activated`,
        user,
      });
  } catch (err) {
    new appError(err, 500);
  }
};

module.exports = {
  signUp,
  login,
  updateProfile,
  deleteAccount,
  logout,
  forgetPassword,
  resetPassword,
  reactivateAccount,
};
