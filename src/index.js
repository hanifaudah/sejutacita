// imports
const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
require("dotenv").config();

// base app
const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/users", routes.userRoutes);
app.use("/admin", routes.adminRoutes);

// db connection
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// port
app.listen(8000);
