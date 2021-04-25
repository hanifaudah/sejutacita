// Imports
const express = require("express");
const routes = require("./routes");

// Base app
const app = express();

// Routes
app.use("/user", routes.userRoutes);

// Port
app.listen(8000);
