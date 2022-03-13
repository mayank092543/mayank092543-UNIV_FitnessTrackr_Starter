const express = require("express");
const activitiesRouter = express.Router();

const { requireUser } = require("./utils");
const { getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity } = require("../db");

activitiesRouter.get("/", async(request, response, next) => {

    const allActivities = await getAllActivities();
    response.send(allActivities);
});
// check with Chai (requireUser)
activitiesRouter.post("/activities", requireUser, async(request, response, next) => {
    const { name, description } = request.body;

    try {
        const createdActivity = await createActivity({ name, description });
        response.send(createdActivity);

    } catch ({ name, message }) {
        next({ name, message })
    }
});

activitiesRouter.patch("/activities/:activityId", requireUser, async(request, response, next) => {
    const { activityId } = request.params;
    const { name, description } = request.body;

    try {
        const updatedActivity = await updateActivity( {activityId, name, description });
        response.send(updatedActivity);

    } catch ({ name, message }) {
        next({ name, message })
    }
});
// check with Chai
activitiesRouter.get("/activities/:activityId/routines", async(request, response, next) => {
    const { activityId } = request.params;

    try {
        const publicRoutinesByActivity = await getPublicRoutinesByActivity ({ activityId });
        response.send (publicRoutinesByActivity);

    } catch ({ name, message }) {
        next({ name, message })
    }
});


module.exports = activitiesRouter;