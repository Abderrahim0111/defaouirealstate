const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");

const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const port = 3000;

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const userRouter = require("./routes/userRoutes");
const listingRouter = require("./routes/listingRoutes");
app.use("/api", userRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "..", "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});
