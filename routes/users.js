const { Router } = require("express");
const usersrouter = Router();
const { User, Post, Comment } = require("../schemas");
const jwt = require("jsonwebtoken");
const { likeRouter } = require("./likes");

usersrouter.use("/:userId/likes", likeRouter);
//계정 가입
usersrouter.post("/signup", async (req, res) => {
  try {
    const { nickname, password, name, age, email } = req.body;
    let NL = nickname.length;
    let PL = password.length;
    for (let i = 0; NL <= PL ? i < NL : i < PL; i++) {
      if (nickname.includes(password.charAt([i])))
        return res
          .status(400)
          .send("Password should not include any of nickname stuffs.");
    }
    if (!nickname) return res.status(400).send({ err: "nickname required" });
    if (!password) return res.status(400).send({ err: "password required" });
    if (!name || !name.first || !name.last)
      return res.status(400).send({ err: "Both first & last names required." });
    const user = new User({ ...req.body });
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
//로그인
usersrouter.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname });

  if (!user || user.password !== password) {
    return res.status(400).json({
      err: "wrong nickname or wrong password.",
    });
  }
  const token = jwt.sign({ userId: user.userId }, "secret-key");
  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token });
});

usersrouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
});
module.exports = { usersrouter };
