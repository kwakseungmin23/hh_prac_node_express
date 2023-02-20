const jwt = require("jsonwebtoken");
const { User } = require("../schemas");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");
  if (authType !== "Bearer" || !authToken) {
    res.status(400).json({ err: "로그인 후에 이용 가능" });
    return;
  }
  try {
    const { userId } = jwt.verify(authToken, "secret-key");
    const user = await User.findById(userId);
    res.locals.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "로그인 후에 이용 가능" });
  }
};
