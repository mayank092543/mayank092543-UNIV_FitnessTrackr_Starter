const client = require('./client');
const {
    createUser,
    getUserById,
    getUserbyUsername
} = require('./users');

const {
    createActivity,
    getAllActivities,
    getActivityById,
    updateActivity
} = require('./activities');

const {
    createRoutine,
    getRoutinesWithoutActivities
} = require('./routines');

const {
    addActivityToRoutine
} = require('./routine_activities');


module.exports = {
    client,
    createUser,
    getUserById,
    getUserbyUsername,

    createActivity,
    getAllActivities,
    getActivityById,
    updateActivity,

    createRoutine,
    getRoutinesWithoutActivities,

    addActivityToRoutine
};