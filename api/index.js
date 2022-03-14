// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
require("dotenv").config();
const express = require("express");
const apiRouter = express.Router();

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db");

apiRouter.use (async(requst, response, next) => {
    const prefix = "Bearer";
    const auth = request.header ("Authorization");

if (!auth) {
    next();
} else if (auth.startWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        
        if(id) {
            request.user = await getUserById(id);
            next();
        }
    
    } catch ({ name, message}) {
    next({ name, message });
}

} else {
    next ({
        name: "AuthorizationHeaderError",
        message: `Authorization token must start with ${prefix}`
    });
}

});


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