const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
    name: String,
    username: String
})

module.exports = mongoose.model("friends", friendSchema);