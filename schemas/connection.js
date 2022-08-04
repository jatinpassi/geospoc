let mongoose = require("mongoose");
let config = require("../config");
//Set up default mongoose connection
mongoose.connect(config.mongoConnection, { useNewUrlParser: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = mongoose;
