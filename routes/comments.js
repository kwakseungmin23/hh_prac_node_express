const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth_middleware = require("../middlewares/auth_middleware.js");
const { Comment } = require("../schemas/comment.js");
const { Post } = require("../schemas/post.js");

//Comment(댓글) POST API => check userId => check name => then Post
router.post("/comments/:postName", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { name, comment } = req.body;
    const { postName } = req.params;
    const foundPostBy = await Post.find({ userId });
    const PostMap = foundPostBy.map((e) => e.name).toString();
    if (postName == PostMap) {
      await Comment.create({
        name,
        comment,
        userId,
      });
    } else if (postName !== PostMap) {
      return res.status(400).send("There is no matching name");
    }
    res.send();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//Comment (댓글) GET API by checking name
router.get("/comments/:postName", async (req, res) => {
  try {
    const { postName } = req.params;
    const comments = await Comment.find({ name: postName });
    res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//Comment PUT API, post's comment modifying.
router.put("/comments/:postId", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { comment } = req.body;
    const { postId } = req.params;
    const existComment = await Comment.findOne({ _id: postId });
    if (existComment)
      await Comment.updateOne(
        { userId },
        { $set: { comment: comment } },
        { new: true }
      );
    res.send();
  } catch (err) {
    console.log(err);
    return resp.status(500).send({ err: err.message });
  }
});
//Comment DELETE API, Deleting by own _id
router.delete("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId))
      return res.status(400).send({ err: "invalid Id" });
    const deleted = await Comment.findOneAndDelete({ _id: postId });
    return res.send({ deleted });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
module.exports = router;
