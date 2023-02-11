const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = model("Posts", PostSchema);
module.exports = { Post };
