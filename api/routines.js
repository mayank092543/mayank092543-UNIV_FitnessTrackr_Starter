const express = require("express");
const routinesRouter = express.Router();

const { requireUser, requiredNotSent} = require("./utils");
const { getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine, destroyRoutine } = require("../db/routines");
const {getRoutineActivitiesByRoutine, addActivityToRoutine } = require("../db/routine_activities");

routinesRouter.get("/", async(request, response, next) => {
    try {
        const allPublicRoutinesWithactivities = await getAllPublicRoutines();
        response.send(allPublicRoutinesWithactivities);

    } catch (error) {
        throw (error);
    }
});

routinesRouter.post("/", requireUser, async(request, response, next) => {
    const { name, goal, isPublic } = request.body;
    const creatorId = request.user.id; 

    try {
        const createdRoutine = await createRoutine({ creatorId, isPublic, name, goal });
        response.send(createdRoutine);

    } catch(error) {
        throw (error);
    }
});

// ** the logged in user should be the owner of the modified object

routinesRouter.patch('/:routineId', requireUser, requiredNotSent({requiredParams: ['name', 'goal', 'isPublic'], atLeastOne: true}), async (request, response, next) => {
    try {
      const {routineId} = request.params;
      const {isPublic, name, goal} = request.body;
      const getRoutine = await getRoutineById(routineId);
      if(!getRoutine) {
        next({
          name: 'NotFound',
          message: `No routine by this ID ${routineId}`
        })
      } else if(getRoutine.creatorId !== request.user.id) {
        next({
          name: "WrongUserError",
          message: "You can not update routine which is not yours"
        });
      } else {
        const updatedRoutine = await updateRoutine({id: routineId, isPublic, name, goal});
        if(updatedRoutine) {
          response.send(updatedRoutine);
        } else {
          next({
            name: 'FailedToUpdate',
            message: 'Error updating your routine'
          })
        }
      }
    } catch (error) {
      next(error);
    }
  });
  
  
  routinesRouter.delete('/:routineId', requireUser, async (request, response, next) => {
    try {
      const {routineId} = request.params;
      const getRoutine = await getRoutineById(routineId);
      if(!getRoutine) {
        next({
          name: 'NotFound',
          message: `No routine by this ID ${routineId}`
        })
      } else if( getRoutine.creatorId !== request.user.id) {
        next({
          name: "WrongUserError",
          message: "You can get routine which is not yours"
        });
      } else {
        const deletedRoutine = await destroyRoutine(routineId)
        response.send({success: true, ...deletedRoutine});
      }
    } catch (error) {
      next(error);
    }
  });

routinesRouter.post("/:routineId/activities", requiredNotSent({requiredParams: ['activityId', 'count', 'duration']}), async(request, response, next) => {
    
    try {
        const {activityId, count, duration} = request.body;
        const {routineId} = request.params;

        const foundRoutineActivities = await getRoutineActivitiesByRoutine({id: routineId});
        const existingRoutineActivities = foundRoutineActivities && foundRoutineActivities.filter(routineActivity => routineActivity.activityId === activityId);

        if(existingRoutineActivities && existingRoutineActivities.length) {
          next({
            name: 'RoutineActivityExistsError',
            message: "A routine_activity by that routineId and activityId combination already exists"
          });

        } else {
          const attachActivityToRoutine = await addActivityToRoutine({ routineId, activityId, count, duration });
          if(attachActivityToRoutine) {
            response.send(attachActivityToRoutine);

          } else {
            next({
              name: 'FailedToCreate',
              message: "There was an error adding activity"
            })
          }
        }
     } catch (error) {
        throw (error);
    }
});

module.exports = routinesRouter;