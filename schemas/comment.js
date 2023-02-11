const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    nickname: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: Number,
      required: true,
      unique: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model("Comments", commentSchema);
module.exports = { Comment };
