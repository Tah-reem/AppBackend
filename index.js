require('dotenv').config();
// require("./db/config");

const User = require("./db/User");
const Todo = require("./db/Todo");
const Friend = require("./db/Friend");
const Post = require("./db/Post");
const Comment = require("./db/Comment");
const Album = require("./db/Album");
const Photo = require("./db/Photo");

const mongoose = require('mongoose');
const express = require("express");
const app = express();

const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const router = express.Router();

const uri = process.env.MONGO_URI;
// console.log('MongoDB URI:', uri); 

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

app.get("/", (req, res) => {
  res.json("hello")
})

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, (err, token) => {
    if (err) {
      res.send({ result: "Something went wrong" });
    }
    res.send({ result, auth: token });
  });
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  let user = await User.findOne(req.body).select("-password");
  if (req.body.password && req.body.email) {
    if (user) {
      Jwt.sign({ user }, jwtKey, (err, token) => {
        if (err) {
          res.send({ result: "Something went wrong" });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "No User Found" });
    }
  } else {
    res.send({ result: "No User Found" });
  }
});

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please provide a valid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please add token with header" });
  }
}

app.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ result: "Something went wrong" });
  }
});

app.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).send({ message: "User deleted successfully" });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting user" });
  }
});

app.post("/users", verifyToken, async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res
      .status(201)
      .send({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Error creating user" });
  }
});

app.put("/users/:id", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedUser) {
      res
        .status(200)
        .send({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Error updating user" });
  }
});

app.get("/todos", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.find();
    res.send(todo);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ result: "Something went wrong" });
  }
});

app.delete("/todos/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (todo) {
      res.status(200).send({ message: "User deleted successfully" });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting user" });
  }
});

app.post("/todos", verifyToken, async (req, res) => {
  try {
    const todo = new Todo(req.body);
    const savedTodo = await todo.save();
    res
      .status(201)
      .send({ message: "User created successfully", user: savedTodo });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Error creating user" });
  }
});

app.put("/todos/:id", verifyToken, async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedTodo) {
      res
        .status(200)
        .send({ message: "User updated successfully", user: updatedTodo });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Error updating user" });
  }
});

app.get("/friends", verifyToken, async (req, res) => {
  try {
    const friend = await Friend.find();
    res.send(friend);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ result: "Something went wrong" });
  }
});

app.get("/postings", verifyToken, async (req, res) => {
  try {
    const post = await Post.find();
    res.send(post);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ result: "Something went wrong" });
  }
});

app.get("/comments", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.find();
    res.send(comment);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ result: "Something went wrong" });
  }
});

app.post("/comments", verifyToken, async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();
    res
      .status(201)
      .send({ message: "Commented successfully", comment: savedComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send({ message: "Error creating comment" });
  }
});

router.get("/albums", verifyToken, async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/photos", verifyToken, async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
