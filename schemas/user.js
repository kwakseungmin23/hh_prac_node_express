const { Schema, model, Types } = require("mongoose");
const { LikeSchema } = require("./like");

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  age: { Number },
  email: { String },
  likes: [LikeSchema],
});

userSchema
  .virtual("like", {
    ref: "Like",
    localField: "likes",
    foreignField: "name",
  })
  .get(function () {
    return this._id.toHexString();
  });
userSchema.set("toJSON", {
  virtuals: true,
});
LikeSchema.set("toObject", { virtuals: true });

const User = model("user", userSchema);
module.exports = { User, userSchema };
