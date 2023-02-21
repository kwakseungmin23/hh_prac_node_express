const Router = require("express");
const { isValidObjectId } = require("mongoose");
const likeRouter = Router({ mergeParams: true });
const { User, Like } = require("../schemas");

likeRouter.patch("/:likeId", async (req, res) => {
  try {
    const { likeId } = req.params;
    const { likeCount } = req.body;
    if (!isValidObjectId(likeId)) {
      return res.send("invalid user Id");
    }
    if (typeof likeCount !== "number") {
      return res.send("invalid likecount");
    }
    const [like] = await Promise.all([
      Like.findOneAndUpdate({ _id: likeId }, { likeCount }, { new: true }),
      User.updateOne(
        { "likes._id": likeId },
        { "likes.$.likeCount": likeCount }
      ),
    ]);
    return res.send({ like });
  } catch (err) {
    console.log(err);
    res.send({ err: err.message });
  }
});

likeRouter.post("/", async (req, res) => {
  try {
    const { userId, likeCount } = req.body;
    if (typeof likeCount !== "number") {
      return res.send("likecount is a number");
    } else if (!isValidObjectId(userId)) {
      return res.send("user Id invalid.");
    }
    let user = await User.findById(userId);
    let like = new Like({ ...req.body, user });
    await like.save();
    return res.send({ like });
  } catch (err) {
    console.log(err);
    return res.send({ err: err.message });
  }
});
likeRouter.get("/", async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.find({ userId }).populate([{ path: "user" }]);

    return res.send({ likes });
    //using populate to show LIKE -> USER !!
  } catch (err) {
    console.log(err);
    return res.send({ err: err.message });
  }
});
module.exports = { likeRouter };
