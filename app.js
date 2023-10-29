const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { connectTo_Bonezz } = require("./models/config");
const usersRoute = require("./routes/userRoute");
const controller = require("./controllers/usersController");
const _BonezzRoute = require("./routes/_BonezzRoute");
const appError = require("./utils/errorHandler");
const errorHandler = require("./controllers/errorController");

const PORT = process.env.PORT || 8000;

const app = express();
connectTo_Bonezz();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to _Bonezz");
});

app.post("/signup", controller.signUp);
app.post("/login", controller.login);
app.post("/logout", controller.logout);
app.post("reactivate", controller.reactivateAccount);

app.use(errorHandler);

app.use("/Users", usersRoute);
app.use("/Bonezz", _BonezzRoute);

app.all("*", (req, res, next) => {
  next(new appError("page not found", 404));
});

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
