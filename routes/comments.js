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
router.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ name: postId });
    res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//Comment PUT API, Comment's content 수정 by mongoDB Unique _id value
router.put("/comments/:postId", async (req, resp) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId))
      return resp.status(400).send({ err: "invalid Id" });

    const { content } = req.body;
    if (!content)
      return resp.status(400).send({ err: "comment changing required" });

    const update = await Comment.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    );

    resp.send({ update });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
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
