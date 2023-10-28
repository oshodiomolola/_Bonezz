const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { connectTo_Bonezz } = require("./config");
const usersRoute = require("./routes/userRoute");
const _BonezzRoute = require("./routes/_BonezzRoute")
const appError = require("./utils/errorHandler");
const errorHandler = require("./Controllers/errorController");

const PORT = process.env.PORT;

const app = express();
connectTo_Bonezz();

app.use(bodyParser.json());

app.use(errorHandler);

app.use("/Users", usersRoute);
app.use("/Bonezz", _BonezzRoute);

app.get("/", (req, res) => {
  res.send("Welcome to _Bonezz");
});

app.all("*", (req, res, next) => {
  next(new appError("page not found", 404));
});

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
