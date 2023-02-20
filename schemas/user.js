const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9]{3,10}$/, "fill upperletter,SmallLetter,Number each"],
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
});

userSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true, // json 형태로 가공할때, userId를 가상 출력 시킨다.
});

module.exports = mongoose.model("User", userSchema);
