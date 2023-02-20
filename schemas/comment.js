const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const commentSchema = new Schema(
  {
    user: { type: ObjectId, required: true, ref: "user" },
    content: {
      type: String,
      required: true,
    },
    post: {
      type: ObjectId,
      required: true,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Comment = model("comment", commentSchema);
module.exports = { Comment, commentSchema };
