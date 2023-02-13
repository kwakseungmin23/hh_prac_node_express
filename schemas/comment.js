const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Comment = model("Comments", commentSchema);
module.exports = { Comment };
