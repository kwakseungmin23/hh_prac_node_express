const express = require("express");
const router = express.Router();
const { Post } = require("../schemas/post.js");
const auth_middleware = require("../middlewares/auth_middleware.js");

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
router.post("/posts", async (req, res) => {
  try {
    const { nickname, password, title, content } = req.body;
    const post = await Post.find({ password });

    if (post.length) {
      return res.status(400).json({
        success: false,
        errorMessage: "Already Existing Password",
      });
    }

    const createPost = await Post.create({
      nickname,
      password,
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
router.put("/posts/:password", auth_middleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { password } = req.params;
    const same = await Post.find({ password });
    const Map = same.map((x) => {
      return x.password;
    });
    for (let i = 0; i < Map.length; i++) {
      if (Map[i] == password) {
        let data = await Post.updateOne(
          { password, userId },
          { $set: req.body },
          { new: true }
        );
        res.send(data);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//게시글 삭제
router.delete("/posts/:password", async (req, res) => {
  try {
    const { password } = req.params;
    const find = await Post.find({ password });
    if (!find.length) {
      return res.status(400).send({ err: "no password existing" });
    } else {
      await Post.deleteOne({ password });
    }
    res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
module.exports = router;
