const mongoose = require('mongoose');
require("dotenv").config();

function connectTo_Bonezz() {
  mongoose.connect(process.env.MONGOOSE_CONNECTION)
  mongoose.connection.on("connected", ()=> {
    console.log("Successfully connected to _Bonezz!")
  })
  mongoose.connection.on("error", (err)=> {
    console.log(err)
    console.log("Connection to _Bonezz failed!")
  })
}

module.exports = { connectTo_Bonezz }