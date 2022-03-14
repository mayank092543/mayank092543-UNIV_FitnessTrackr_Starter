const express = require("express");
const routinesRouter = express.Router();

const { requireUser } = require("./utils");
const { getAllPublicRoutines, createRoutine, getRoutinebyId, updateRoutine, destroyRoutine } = require("../db/routines");
const { addActivityToRoutine } = require("../db/routine_activities");

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
    const creatorId = request.user.id; // check with chai and db is not right? has name twice

    try {
        const createdRoutine = await createRoutine({ creatorId, isPublic, name, goal });
        response.send(createdRoutine);

    } catch(error) {
        throw (error);
    }
});

routinesRouter.patch("/:routineId", requireUser, async(request, response, next) => {
    const { routineId } = request.params;
    const { isPublic, name, goal } = request.body;

    try { // ** the logged in user should be the owner of the modified object
        const { ownerId } = await getRoutinebyId(routineId)

        if (ownerId === request.user.id) {
            const updatedRoutine = await updateRoutine({ routineId, isPublic, name, goal}) // do i need to justify isPublic status?
            response.send(updatedRoutine);
        } else {
            next({
            name: "UnauthorizedUserError",
            message: "You cannot update routine which is not yours"
            })   
        }
    } catch (error){
        throw (error);
    }
});

routinesRouter.delete("/:routineId", requireUser, async(request, response, next) => {
    const{ routineId } = request.params;

    try { // this has ** the logged in user should be the owner of the modified object
        const { ownerId } = await getRoutinebyId(routineId)

        if ( ownerId === request.user.id) {
            const deleteRoutine = await destroyRoutine(routineId)
            
            response.send(deleteRoutine);
        } else {
            next ({
                name: "UnauthorizedUserError",
                message: "You cannot delete a routine which is not yours"
            })
        }

    } catch(error) {
        throw (error);
    }
});

routinesRouter.post("/:routineId/activities", async(request, response, next) => {
    const { routineId } = request.params;
    const{ activityId, count, duration } = request.body;

    try {
            const attachActivityToRoutine = await addActivityToRoutine({ routineId, activityId, count, duration })
            response.send(attachActivityToRoutine)
        }
        catch (error) {
        throw (error);
    }
})

module.exports = routinesRouter;