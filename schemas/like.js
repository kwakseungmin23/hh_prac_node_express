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
  likeCount: { type: Number, required: true, default: 0 },
});
// LikeSchema.virtual("user", {
//   ref: "user",
//   localField: "_id",
//   foreignField: "like",
// });
// LikeSchema.set("toObject", { virtuals: true });
// LikeSchema.set("toJSON", { virtuals: true });
const Like = model("Like", LikeSchema);
module.exports = { Like, LikeSchema };
