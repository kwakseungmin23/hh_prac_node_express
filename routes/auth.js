const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
//log in API
router.post("/login", async (req, res) => {
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

module.exports = router;
