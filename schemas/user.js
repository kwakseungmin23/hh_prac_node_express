const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
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
  isLike: { type: Boolean, required: true, default: false },
});

userSchema
  .virtual("userId", {
    ref: "userId",
    localField: "_id",
    foreignField: "User",
  })
  .get(function () {
    return this._id.toHexString();
  });
userSchema.set("toJSON", {
  virtuals: true,
});

const User = model("user", userSchema);
module.exports = { User, userSchema };
