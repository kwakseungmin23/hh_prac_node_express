const { Router } = require("express");
const postrouter = Router();
const { isValidObjectId } = require("mongoose");
const { Post, User } = require("../schemas");
const auth_middleware = require("../middlewares/auth_middleware.js");
const { commentsRouter } = require("./comments");

postrouter.use("/:postId/comments", commentsRouter);
//게시글 조회 API
postrouter.get("/", async (req, res) => {
  try {
    const Posts = await Post.find({}).populate([
      { path: "user" },
      { path: "comment", populate: { path: "user" } },
    ]);
    return res.send(Posts);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 포스트 API
postrouter.post("/", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    let user = await User.findById(userId);
    const post = new Post({ ...req.body, user });
    await post.save();
    return res.send({ post });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 상세 조회
postrouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const posts = await Post.findOne({ _id: postId });
    return res.send({ posts });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 수정하기
postrouter.put("/:postId", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { content } = req.body;
    const existPost = await Post.findOne({ _id: postId }); // 정상작동
    if (existPost)
      await Post.updateOne(
        { userId },
        { $set: { content: content } },
        { new: true }
      );
    res.send();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 삭제
postrouter.delete("/:postId", auth_middleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const find = await Post.findOne({ _id: postId });
    if (find) await Post.deleteOne({ userId });
    res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
module.exports = { postrouter };
