const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
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
  },
  { timestamps: true }
);
PostSchema.virtual("comment", {
  ref: "comment",
  localField: "_id",
  foreignField: "Post",
});
PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });
const Post = model("Post", PostSchema);
module.exports = { Post };
