const express = require("express");
const activitiesRouter = express.Router();

const { requireUser } = require("./utils");
const { getPublicRoutinesByActivity } = require("../db");
const { getAllActivities, createActivity, updateActivity } = require("../db/activities");


activitiesRouter.get("/", async(request, response, next) => {
    try {
        const allActivities = await getAllActivities();
        response.send(allActivities);

    } catch (error) {
        throw error
    }
    
});

activitiesRouter.post("/", requireUser, async(request, response, next) => {
    const { name, description } = request.body;

    try {
        const createdActivity = await createActivity({ name, description });
        response.send(createdActivity);

    } catch (error) {
        throw (error)
    }
});

activitiesRouter.patch("/:activityId", requireUser, async(request, response, next) => {
    const { activityId } = request.params; // activityId = id
    const { name, description } = request.body;

    try {
        const updatedActivity = await updateActivity( {activityId, name, description });
        response.send(updatedActivity);

    } catch ({ name, message }) {
        next({ name, message })
    }
});

activitiesRouter.get("/:activityId/routines", async(request, response, next) => {
    const { activityId } = request.params;

    try {
        const publicRoutinesByActivity = await getPublicRoutinesByActivity ({ activityId });
        response.send (publicRoutinesByActivity);

    } catch (error) {
        throw (error)
    }
});


module.exports = activitiesRouter;