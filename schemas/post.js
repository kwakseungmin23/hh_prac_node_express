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
  },
  { timestamps: true }
);

PostSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
PostSchema.set("toJSON", {
  virtuals: true, // json 형태로 가공할때, userId를 가상 출력 시킨다.
});

const Post = model("Posts", PostSchema);
module.exports = { Post };
