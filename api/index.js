// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router

const client = require("../db");
const express = require("express");
const apiRouter = express.Router();

const jwt = require("jsonwebtoken");
const { JWT_SECRET = "neverTell" } = process.env;
const { getUserById } = require("../db");


apiRouter.use(async (request, response, next) => {
    const prefix = 'Bearer ';
    const auth = request.header('Authorization');
    
    if (!auth) { 
      next();

    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
        
        if (id) {
          request.user = await getUserById(id);
          next();
        }
      } catch (error) {
        next(error);
      }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
    }
  });
  
  apiRouter.use((request, response, next) => {
    if (request.user) {
      console.log("User is set:", request.user);
    }
    next();
  });


apiRouter.get("/health", async(request, response, next) => {
    response.send({
        message: "Its Healthy"
    })
})


const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

const routine_activities = require("./routine_activities");
apiRouter.use("/routine_activities", routine_activities);

module.exports = apiRouter;