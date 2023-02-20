const { Router } = require("express");
const commentsRouter = Router({ mergeParams: true });
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const auth_middleware = require("../middlewares/auth_middleware.js");
const { Comment, Post, User } = require("../schemas");

//Comment(댓글) POST API
commentsRouter.post("/", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { content } = req.body;
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
      return res.status(400).send({ err: "blogId is invalid" });
    }
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ err: "userId is invalid" });
    }
    if (typeof content !== "string") {
      return res.status(400).send({ err: "content required" });
    }
    const [post, user] = await Promise.all([
      Post.findById(postId),
      User.findById(userId),
    ]);
    if (!post || !user)
      return res.status(400).send({ err: "blog or user does not exist" });

    const comment = new Comment({
      content,
      user,
      post,
    });
    await Promise.all([
      comment.save(),
      Post.updateOne({ _id: postId }, { $push: { comments: comment } }),
    ]);

    return res.send({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//Comment (댓글) GET API
commentsRouter.get("/", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate([
      { path: "post", populate: { path: "user" } },
      // { path: "user" },
    ]);
    return res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//Comment PUT API, post's comment modifying.
commentsRouter.put("/:commentId");
//Comment DELETE API
commentsRouter.delete("/:commentId", auth_middleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = res.locals.user;

    if (!mongoose.isValidObjectId(commentId))
      return res.status(400).send({ err: "invalid Id" });
    const findOne = await Comment.findOne({ _id: commentId });
    const deleted = await findOne.deleteOne({ userId });
    return res.send({ deleted });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
module.exports = { commentsRouter };
