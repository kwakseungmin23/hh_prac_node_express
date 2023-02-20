const { Router } = require("express");
const usersrouter = Router();
const { User, Post, Comment, userSchema } = require("../schemas");
const jwt = require("jsonwebtoken");

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
//login API
usersrouter.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname });

  //이메일 일치하는 유저가 존재하지 않거나, 유저를 찾았지만 비밀번호와 입력 비밀번호가 다를때,
  if (!user || user.password !== password) {
    res.status(400).json({
      err: "로그인 실패",
    });
    return;
  }
  const token = jwt.sign({ userId: user.userId }, "secret-key");
  res.cookie("Authorization", `Bearer ${token}`); // bearer type - jwt type
  res.status(200).json({ token });
});

module.exports = { usersrouter };
