const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      Number,
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
  },
  { timestamps: true }
);

const Post = model("Posts", PostSchema);
module.exports = { Post };
