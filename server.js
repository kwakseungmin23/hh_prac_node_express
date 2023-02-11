const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const connect = require("./schemas");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use("/api", [postsRouter, commentsRouter, usersRouter, authRouter]);

app.get("/", (req, res) => {
  res.send("Bullet In Board Practicing");
});

app.listen(3000, () => {
  console.log(3000, "Server listening on port 3000");
});
