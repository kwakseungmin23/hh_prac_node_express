const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const { commentSchema } = require("./comment");
const PostSchema = new Schema(
  {
    user: {
      _id: { type: ObjectId, required: true, ref: "user" },
      nickname: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: false },
      },
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = model("Post", PostSchema);
module.exports = { Post };
