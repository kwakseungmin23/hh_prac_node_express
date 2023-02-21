const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const LikeSchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  likes: { type: Number, default: 0 },
});
LikeSchema.virtual("userId", {
  ref: "user",
  localField: "_id",
  foreignField: "userId",
});
LikeSchema.set("toObject", { virtuals: true });
LikeSchema.set("toJSON", { virtuals: true });
const Like = model("Like", LikeSchema);
module.exports = { Like, LikeSchema };
