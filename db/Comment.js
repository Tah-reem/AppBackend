const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: String,
    username: String,
    comment: String
})

module.exports = mongoose.model("comments", commentSchema);