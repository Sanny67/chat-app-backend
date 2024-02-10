const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const apiRoutes = require("./app/index.route.js");
app.use("/api", apiRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("DB connection successful");
})
.catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
})