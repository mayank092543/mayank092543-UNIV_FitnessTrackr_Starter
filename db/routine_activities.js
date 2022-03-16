const client = require('./client');

async function getRoutineActivityById(id) {
    try {
        const { rows: [ routine_activity ] } = await client.query(`
        SELECT * 
        FROM routine_activities
        WHERE id=$1
        `, [id])
        
        return routine_activity
    } catch (error) {
        throw error
    }
}

async function addActivityToRoutine({
    routineId,
    activityId,
    count,
    duration
}) {

    try {
        const { rows: [routine_activity] } = await client.query(`
        INSERT INTO routine_activities("routineId", "activityId", "duration", "count") 
        VALUES($1, $2, $3, $4)
        ON CONFLICT ("routineId", "activityId")
        DO NOTHING 
        RETURNING *;
      `, [routineId, activityId, duration, count]);

        return routine_activity;
    } catch (error) {
        throw error;
    }
}

async function updateRoutineActivity({ id, count, duration }) {
    try {
        const { rows: [ updatedRoutineActivity ] } = await client.query(`
        UPDATE routine_activities
        SET count=$1
        duration=$2
        WHERE id=$3
        RETURNING *;
        `[count, duration, id])
        
        return updatedRoutineActivity
    } catch (error) {
        throw error
    }
}

async function destroyRoutineActivity(id) {
    try {
        const { rows: [ deleteRoutineActivity ] } = await client.query(`
        DELETE routine_activities
        WHERE id=$1
        RETURNING *;
        `,[id])

        return deleteRoutineActivity
    } catch (error) {
        throw error
    }
}

async function getRoutineActivitiesByRoutine({ id }) {
    try {
        const { rows: [ allRoutines ] } = await client.query(`
        SELECT *
        FROM routine_activities
        WHERE "routineId"=$1
        `, [id])

        return allRoutines
    } catch (error) {
        throw error
    }
}

module.exports = {
    getRoutineActivityById,
    addActivityToRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
}