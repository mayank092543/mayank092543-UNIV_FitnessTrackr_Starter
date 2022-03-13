// require and re-export all files in this db directory (users, activities...)
const {
    userClient,
    createUser,
    getUserById,
    getUserbyUsername
} = require('./users.js');

const {
    activityClient,
    createActivity,
    getAllActivities
} = require('./activities.js');

const {
    routineClient,
    createRoutine,
    getRoutinesWithoutActivities
} = require('./routines.js')

// const {
//     routineActivityClient,
//     addActivityToRoutine
// } = require('./routine_activities.js')


module.exports = {
    userClient,
    createUser,
    getUserById,
    getUserbyUsername,

    activityClient,
    createActivity,
    getAllActivities,

    routineClient,
    createRoutine,
    getRoutinesWithoutActivities,

    // routineActivityClient,
    // addActivityToRoutine
}