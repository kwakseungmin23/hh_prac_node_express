const Router = require("express");
const { isValidObjectId } = require("mongoose");
const likeRouter = Router({ mergeParams: true });
const { User, Like, userSchema } = require("../schemas");

likeRouter.get("/", async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.findOne({ userId }).populate({
      path: "user",
      populate: { path: "likes" },
    });
    await likes.save();
    return res.send({ likes });
    //using populate to show LIKE -> USER !!
  } catch (err) {
    console.log(err);
    return res.send({ err: err.message });
  }
});

likeRouter.post("/", async (req, res) => {
  try {
    const { likes, userId } = req.body;
    let user = await User.findById(userId);
    const likePost = new Like({ ...req.body, user });
    await likePost.save();
    return res.send({ likePost });
  } catch (err) {
    console.log(err);
    return res.send({ err: err.message });
  }
});

likeRouter.patch("/:likeId", async (req, res) => {
  try {
    const { likeId } = req.params;
    const result = await Like.findOneAndUpdate(
      { _id: likeId },
      { $inc: { likes: +1 } },
      { new: true }
    );
    return res.send({ result });
  } catch (err) {
    console.log(err);
    return res.send({ err: err.message });
  }
});
module.exports = { likeRouter };
