const { Router } = require("express");
const commentsRouter = Router({ mergeParams: true });
const mongoose = require("mongoose");
const auth_middleware = require("../middlewares/auth_middleware.js");
const { Comment, Post } = require("../schemas");

//Comment(댓글) POST API => check userId => check name => then Post
commentsRouter.post(
  "/comments/:postName",
  auth_middleware,
  async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { name, comment } = req.body;
      const { postName } = req.params;
      const foundPostBy = await Post.find({ userId });
      const PostMap = foundPostBy.map((e) => e.name).toString();
      if (postName == PostMap) {
        await Comment.create(
          {
            name,
            comment,
            userId,
          },
          { new: true }
        );
      } else if (postName !== PostMap) {
        return res.status(400).send("There is no matching name");
      }
      res.send();
    } catch (err) {
      console.log(err);
      return res.status(500).send({ err: err.message });
    }
  }
);
//Comment (댓글) GET API by checking name
commentsRouter.get("/comments/:postName", async (req, res) => {
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
commentsRouter.put("/comments/:postId", auth_middleware, async (req, res) => {
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
    return res.status(500).send({ err: err.message });
  }
});
//Comment DELETE API
commentsRouter.delete(
  "/comments/:postId",
  auth_middleware,
  async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      if (!mongoose.isValidObjectId(postId))
        return res.status(400).send({ err: "invalid Id" });
      const findOne = await Comment.findOne({ _id: postId });
      const deleted = await findOne.deleteOne({ userId });
      return res.send({ deleted });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ err: err.message });
    }
  }
);
module.exports = { commentsRouter };
