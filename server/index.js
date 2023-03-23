import {} from "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";

import User from "./models/User.js";
import Todo from "./models/Todo.js";

await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", () => {
  console.log("Connection error");
});

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

const secret = "secret";

app.get("/", (req, res) => {
  res.send({ user: "ok" });
});

// to login user after a refresh
app.get("/user", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  User.findById(payload.id).then((userInfo) => {
    res.json({ id: userInfo._id, email: userInfo.email });
  });
});

// to register new user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ email: email, password: hashedPassword });
  user.save().then((userInfo) => {
    // console.log(userInfo);
    jwt.sign(
      { id: userInfo._id, email: userInfo.email },
      secret,
      (err, token) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res
            .cookie("token", token)
            .json({ id: userInfo._id, email: userInfo.email });
        }
      }
    );
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email: email }).then((userInfo) => {
    const passwordCheck =
      password && userInfo?.password
        ? bcrypt.compareSync(password, userInfo.password)
        : false;
    if (passwordCheck) {
      jwt.sign({ id: userInfo._id, email: email }, secret, (err, token) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res
            .cookie("token", token)
            .json({ id: userInfo._id, email: userInfo.email });
        }
      });
    } else {
      res.sendStatus(401);
    }
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").send();
});

app.get("/todos", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  Todo.where({ user: new mongoose.Types.ObjectId(payload.id) })
    .find()
    .then((todos) => res.json(todos));
});

app.put("/todos", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  const todo = new Todo({
    text: req.body.text,
    done: false,
    user: new mongoose.Types.ObjectId(payload.id),
  });
  todo.save().then((todo) => {
    res.json(todo);
  });
});

app.post("/todos", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  Todo.updateOne(
    {
      _id: new mongoose.Types.ObjectId(req.body.id),
      user: new mongoose.Types.ObjectId(payload.id),
    },
    { done: req.body.done }
  ).then(() => {
    res.sendStatus(200);
  });
});

if (process.env.PORT) {
  app.listen(process.env.PORT, () => {
    console.log("Server running...");
  });
}

export default app;
