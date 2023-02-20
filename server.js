const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://Seungmin_Kwak:rhkrtmdals98@cluster0.3hbka9r.mongodb.net/BulletIn";
mongoose.set("strictQuery", false);
mongoose.set("debug", false);
const server = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieparser());
    app.use("/user", usersRouter);
    app.use("/post", postsRouter);

    app.listen(3000, () => {
      console.log(3000, "Server listening on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
};
server();
