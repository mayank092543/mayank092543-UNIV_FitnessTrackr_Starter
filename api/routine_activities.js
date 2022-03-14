const express = require("express");
const routine_activities = express.Router();

const{ requireUser } = require("./utils");
const { getRoutineActivityById, updateRoutineActivity, destroyRoutineActivity } = require("../db");
const { getRoutineById } = require("../db/routines");


routine_activities.patch("/:routineActivityId", requireUser, async(request, response, next) => {
    const { routineActivityId } = request.params; // id
    const { count, duration } = request.body;

    // this has ** the logged in user should be the owner of the modified object
    try {
    const { ownerId} = await getRoutineById(routineActivityId)
    if (ownerId === request.user.id){
        const updatedRoutineActivity = await updateRoutineActivity({routineActivityId, count, duration })
        response.send(updatedRoutineActivity);

    } else {
        next()
    }
} catch (error) {
    throw (error)
}

});

routine_activities.delete("/:routineActivityId", requireUser, async(request, response, next) => {
    const { routineActivityId } = request.params;

    try {  // this has ** the logged in user should be the owner of the modified object
        const { ownerId } = await getRoutineById(routineActivityId);
        if (ownerId === request.user.id) {
            const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId)
            response.send(deletedRoutineActivity);

        } else {
            next()
        }

    } catch (error) {
        throw (error);
    }
});


module.exports = routine_activities;