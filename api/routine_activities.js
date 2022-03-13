const express = require("express");
const routine_activities = express.Router();

const{ requireUser } = require("./utils");
const { getRoutineActivityById, updateRoutineActivity, destroyRoutineActivity } = require("../db");


routine_activities.patch("/routine_activities/:routineActivityId", requireUser, async(request, response, next) => {
    const { routineActivityId } = request.params;
    const { count, duration } = request.body;

    // this has ** the logged in user should be the owner of the modified object
    try {
    const originalRoutineActivity = await getRoutineActivityById(routineActivityId)
    if (originalRoutineActivity.id === request.user.id){
        const updatedRoutineActivity = await updateRoutineActivity({routineActivityId, count, duration })
        response.send(updatedRoutineActivity);
    } else {
        next ({
            name: "UnauthorizedUserError",
            message: "You can't update routine activity which is not yours"
        })
    }
} catch ({ name, message }) {
    next({ name, message })
}

});

routine_activities.delete("/routine_activities/:routineActivityId", requireUser, async(request, response, next) => {
    const { routineActivityId } = request.params;

    try {
        const original_Routine_Activity = await getRoutineActivityById(routineActivityId);
        if (original_Routine_Activity.id === request.user.id) {
            const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId)
            response.send(deletedRoutineActivity)
        } else {
            next({
                name: "UnauthorizedUserError",
                message: "You can't delete routine activity which is not yours"
            })
        }

    } catch ({ name, message }) {
        next({ name, message });
    }
})


module.exports = routine_activities;