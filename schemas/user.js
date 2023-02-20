const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    match: /[A-Za-z0-9]{3,}/g,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: false },
  },
  age: { Number, required: true },
  email: { String, required: true, unique: true },
});

userSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});

const User = model("user", userSchema);
module.exports = { User };
