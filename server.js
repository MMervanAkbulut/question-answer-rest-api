const express = require("express");
const dotenv = require("dotenv");
const connnectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
// const question = require("./routers/question");
// const auth = require("./routers/auth");
const routers = require("./routers");
const path = require("path");



// Environment Variables
dotenv.config({
  path: "./config/env/config.env",
});

// mongodb connection
connnectDatabase();

const app = express();

// express - body middleware
app.use(express.json());

const PORT = process.env.PORT;

// routers middleware
// modüler hale getirildi
app.use("/api", routers);


// Error Handler => middleware
app.use(customErrorHandler);

// Static Files
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`);
});
