const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const db = require("./models");

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// VIEW ROUTES
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "public/stats.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "public/exercise.html"));
});

// API ROUTES
app.get("/api/workouts", async (req, res) => {
  try {
    const workouts = await db.Workout.find({});
    res.json(workouts);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.get("/api/workouts/range", async (req, res) => {
  let workouts;
  try {
    workouts = await db.Workout.find({}).limit(7);
    res.json(workouts);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.put("/api/workouts/:id", async (req, res) => {
  console.log(req.body);
  try {
    const workout = await db.Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: req.body } });
    console.log(workout);
    res.json(workout);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

app.post("/api/workouts", async (req, res) => {
  console.log(req.body);
  try {
    const workout = await db.Workout.create({});
    console.log(workout);
    res.json(workout);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
