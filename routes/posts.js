const { Router } = require("express");
const postrouter = Router();
const { isValidObjectId } = require("mongoose");
const { Post, User } = require("../schemas/");
const auth_middleware = require("../middlewares/auth_middleware.js");
const { commentsRouter } = require("./comments");

postrouter.use("/:postId/comments", commentsRouter);
//게시글 조회 API
postrouter.get("/posts", async (req, res) => {
  try {
    const foundedPosts = await Post.find({}).select(
      "nickname title content createdAt"
    );
    foundedPosts.map((x) => x.createdAt).sort();
    return res.send(foundedPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 포스트 API
postrouter.post("/posts", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { name, title, content } = req.body;
    const existPost = await Post.find({ userId });
    if (existPost.length) {
      return res.status(400).json({
        success: false,
        error: "Already Existing Post",
      });
    }
    await Post.create({
      name,
      title,
      content,
      userId,
    });
    return res.send("success");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 상세 조회
postrouter.get("/posts/:postId", async (req, res) => {
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
postrouter.put("/posts/:postId", auth_middleware, async (req, res) => {
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
postrouter.delete("/posts/:postId", auth_middleware, async (req, res) => {
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
