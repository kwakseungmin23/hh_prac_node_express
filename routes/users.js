const express = require("express");
const router = express.Router();
const userSchema = require("../schemas/user");
const authMiddleware = require("../middlewares/auth_middleware");
//계정 정보 확인
router.get("/signup/me", authMiddleware, async (req, res) => {
  const { password, nickname } = res.locals.user;
  res.status(200).json({
    user: {
      password: password,
      nickname: nickname,
    },
  });
});
//계정 가입
router.post("/signup", async (req, res) => {
  const { nickname, password, confirmPw } = req.body;
  if (password !== confirmPw) {
    res.status(400).json({ err: "Password does not match." });
    return;
  }
  let spl = nickname.split("");
  let splPw = password.split("");
  for (let i = 0; i < spl.length; i++) {
    if (spl[i] == splPw[i]) {
      return res
        .status(400)
        .send({ err: "Password should not include any of nickname stuffs." });
    }
  }
  const ExistUser = await userSchema.findOne({
    $or: [{ nickname }, { password }],
  });
  if (ExistUser) {
    if (ExistUser.nickname == nickname) {
      return res.status(400).send({ err: "nickname exist" });
    } else if (ExistUser.password == password) {
      res.status(400).send({ err: "password exist" });
    }
  } else if (!ExistUser) {
    const user = new userSchema({ nickname, password });
    await user.save();
    return res.status(201).json({}); // 201 -> something created
  }
});

module.exports = router;
