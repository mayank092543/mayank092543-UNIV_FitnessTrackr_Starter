const client = require('./client');
// const { Client } = require('pg');
// 
// const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/fitness-dev';
// const routineActivityClient = new Client(CONNECTION_STRING);



// addActivityToRoutine({ routineId, activityId, count, duration })
// create a new routine_activity, and return it
//      routine_activity {
//          "id": 11,
//          "routineId": 6,
//          "activityId": 7,
//          "duration": 30,
//          "count": 2
//      }
async function addActivityToRoutine({
    routineId,
    activityId,
    count,
    duration
}) {

    try {
        const { rows: [routine_activity] } = await routineActivityClient.query(`
        INSERT INTO routine_activities(routineId, activityId, duration, count) 
        VALUES($1, $2, $3, $4) 
        RETURNING *;
      `, [routineId, activityId, duration, count]);

        return routine_activity;
    } catch (error) {
        throw error;
    }
}




module.exports = {
    addActivityToRoutine
}