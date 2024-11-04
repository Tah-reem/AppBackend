const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  albumId: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const Photo = mongoose.model("photos", photoSchema);
module.exports = Photo;
