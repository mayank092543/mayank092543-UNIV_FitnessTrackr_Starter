const express = require("express");
const activitiesRouter = express.Router();

const { requireUser, requiredNotSent } = require("./utils");
const { getPublicRoutinesByActivity } = require("../db");
const { getAllActivities, createActivity, updateActivity, getActivityByName, getActivityById } = require("../db/activities");


activitiesRouter.get("/", async(request, response, next) => {
    try {
        const allActivities = await getAllActivities();
        response.send(allActivities);

    } catch (error) {
        next(error)
    }
    
});

activitiesRouter.post("/", requireUser, requiredNotSent({requiredParams: ['name', 'description']}), async(request, response, next) => {

    try {
        const { name, description } = request.body;
        const existingActivity = await getActivityByName(name);
        if(existingActivity) {
          next({
            name: 'NotFound',
            message: `An activity with name ${name} already exists`
          });
        } else {
          const createdActivity = await createActivity({name, description});
          if(createdActivity) {
            response.send(createdActivity);
          } else {
            next({
              name: 'FailedToCreate',
              message: 'There was an error creating your activity'
            })
          }
        }
      } catch (error) {
        next(error);
      }
    });

activitiesRouter.patch("/:activityId", requireUser, requiredNotSent({requiredParams: ['name', 'description'], atLeastOne: true}), async(request, response, next) => {
    try {
        const { activityId } = request.params;
        const { name, description } = request.body;
        const getActivity = await getActivityById(activityId)

        if (!getActivity) {
            next({
                name: "ActivityNotFound",
                message: `There is no activity by this ID ${activityId}`
            })
        } else {
            const updatedActivity = await updateActivity( {id: activityId, name, description });
            if(updatedActivity) {
                response.send(updatedActivity);
            } else {
                next({
                    name: "UpdateError",
                    message: "Failed to update activity"
                })
            }
        }
    } catch (error) {
        next(error)
    }  
});

activitiesRouter.get("/:activityId/routines", async(request, response, next) => {
    const { activityId } = request.params;

    try {
        const publicRoutinesByActivity = await getPublicRoutinesByActivity ({id: activityId });

        if (publicRoutinesByActivity) {
            response.send (publicRoutinesByActivity);
        } 
        else {
            next({
                name: "PublicRountineError",
                message: `There is no Public Rountine Activity by this ID ${activityId}`
            })
        }
    } catch (error) {
        throw (error)
    }
});


module.exports = activitiesRouter;