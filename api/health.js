const express = require("express");
const healthRouter = express.Router();

healthRouter.use((request, response, next) => {
    console.log("A request is being made to /health");

    next();
});

healthRouter.get("/", async(request, response, next) => {
    response.send("All is Well");
});

module.exports = healthRouter;
