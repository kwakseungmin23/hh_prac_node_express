const express = require("express");
const router = express.Router();
const { Post } = require("../schemas/post.js");
const auth_middleware = require("../middlewares/auth_middleware.js");
const mongoose = require("mongoose");

//게시글 조회 API
router.get("/posts", async (req, res) => {
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
router.post("/posts", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { name, title, content } = req.body;
    const post = await Post.find({ _id: userId });

    if (post.length) {
      return res.status(400).json({
        success: false,
        errorMessage: "Already Existing Password",
      });
    }

    const createPost = await Post.create({
      name,
      title,
      content,
    });

    return res.json({ post: createPost });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 상세 조회 by password
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const find = await Post.find({ password: postId });

    if (!find.length) {
      return res.status(400).send({ err: "no password exisiting" });
    } else {
      res.send({ find });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 수정하기
router.put("/posts/:postId", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId))
      return res.status(400).send({ err: "invalid postId" });
    const { content } = req.body;
    let updatebody = {};
    if (content) updatebody.content = content;
    const post = await Post.updateOne(
      { userId, postId },
      { $set: { updatebody } },
      {
        new: true,
      }
    );
    return res.send({ post });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 삭제
router.delete("/posts/:password", auth_middleware, async (req, res) => {
  try {
    const { password } = req.params;
    const { userId } = res.locals.user;
    const find = await Post.find({ password });
    if (!find.length) {
      return res.status(400).send({ err: "no password existing" });
    } else {
      await Post.deleteOne({ password, userId });
    }
    res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
module.exports = router;
