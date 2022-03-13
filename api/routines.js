const express = require("express");
const routinesRouter = express.Router();

const { requireUser } = require("./utils");
const { getAllPublicRoutines, createRoutine, getRoutinebyId, updateRoutine, destroyRoutine, getRoutineActivitiesByRoutine } = require("../db");

routinesRouter.get("/", async(request, response, next) => {
    try {
        const allPublicRoutinesWithactivities = await getAllPublicRoutines();
        response.send(allPublicRoutinesWithactivities);

    } catch ({ name, message }) {
        next({ name, message });
    }
});

routinesRouter.post("/routines", requireUser, async(request, response, next) => {
    const { name, goal, isPublic } = request.body;
    const creatorId = request.user.id; // check with chai and db is not right? has name twice

    try {
        const createdRoutine = await createRoutine({ creatorId, isPublic, name, goal });
        response.send(createdRoutine);

    } catch({ name, message }) {
        next({ name, message });
    }
});

routinesRouter.patch("/routines/:routineId", requireUser, async(request, response, next) => {
    const { routineId } = request.params;
    const { isPublic, name, goal } = request.body;

    try { // ** the logged in user should be the owner of the modified object
        const originalRoutines = await getRoutinebyId(routineId)

        if (originalRoutines.id === request.user.id) { //originalRoutines.id?
            const updatedRoutine = await updateRoutine({ routineId, isPublic, name, goal}) // do i need to justify isPublic status?
            response.send(updatedRoutine);

        } else {
            next({
                name: "UnauthorizedUserError",
                message: "You cannot update a post which is not yours"
            });
        }
    } catch ({ name, message }){
        next({ name, message });
    }
});

routinesRouter.delete("/routines/:routineId", requireUser, async(request, response, next) => {
    const{ routineId } = request.params;

    try { // No idea?????
        const deleteRoutine = await getRoutinebyId(routineId)

        if (deleteRoutine && deleteRoutine.id === request.user.id) { //routine.id?
            const deleteRoutine = await destroyRoutine(routineId)

            const queriedRoutineActivities = await getRoutineActivitiesByRoutine(routineId)
        }
    } catch({ name, message }) {
        next({ name, message })
    }
});

routinesRouter.post("/routines/:routineId/activities", async(request, response, next) => {
    const { routineId } = request.params;
    const{ activityId, count, duration } = request.body;

    try {
        // Prevent duplication on routineId, activityId
         if (routineId !== activityId) {
            const attachActivityToRoutine = await addActivityToRoutine({ routineId, activityId, count, duration })
            response.send(attachActivityToRoutine)
        } else {
            next({
                name: "DuplicationError",
                message: "RoutineId and ActiviyId can't be duplicate"
            });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
})

module.exports = routinesRouter;