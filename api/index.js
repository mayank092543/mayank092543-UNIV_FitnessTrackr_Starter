// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router

const express = require("express");
const apiRouter = express.Router();

require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env

//set "request.user" if possible

const healthRouter = require("./health");
apiRouter.use("/health", healthRouter);

const usersRouter = require("./users");
apiRouter.use("./users", usersRouter);


module.exports = apiRouter;

