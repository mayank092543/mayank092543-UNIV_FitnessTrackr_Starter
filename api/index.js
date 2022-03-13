// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router

const express = require("express");
const apiRouter = express.Router();


//set "request.user" if possible

const healthRouter = require("./health");
apiRouter.use("/health", healthRouter);

const usersRouter = require("./users");
apiRouter.use("./users", usersRouter);

const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

const routine_activities = require("./routine_activities");
apiRouter.use("/routine_activities", routine_activities);

module.exports = apiRouter;

