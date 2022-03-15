// // require and re-export all files in this db directory (users, activities...)
const client = require('./client');
const {
    createUser,
    getUser,
    getUserById,
    getUserbyUsername
} = require('./users');

const {
    getActivityById,
    createActivity,
    getAllActivities,
    updateActivity
} = require('./activities');

// const {
//     createRoutine,
//     getRoutinesWithoutActivities,
//     getAllRoutines,
//     updateRoutine,
//     getRoutineById,
//     destroyRoutine,
//     getAllPublicRoutines,
//     getAllRoutinesByUser,
//     getPublicRoutinesByUser,
//     getPublicRoutinesByActivity
// } = require('./routines')

const {
    getRoutineActivityById,
    addActivityToRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
} = require('./routine_activities')


module.exports = {
    client,
   ...require("./users"),
   ...require("./activities"),
//    ...require("./routines"),
   ...require("./routine_activities")
}
