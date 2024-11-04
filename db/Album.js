const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true }
})

module.exports = mongoose.model("albums", albumSchema);