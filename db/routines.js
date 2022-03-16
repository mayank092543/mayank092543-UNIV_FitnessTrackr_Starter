const client = require('./client');

async function getRoutineById(id) {
    try {
        const { rows: [routine] } = await client.query(`
        SELECT *
        FROM routines
        WHERE routineId=$1
      `[id]);

        return routine;
    } catch (error) {
        throw error;
    }
}


async function getRoutinesWithoutActivities() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routines
      `);

        return rows;
    } catch (error) {
        throw error;
    }
}


// // getAllRoutines
// // select and return an array of all routines, include their activities

async function getAllRoutines() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routines;
        `);

        return rows;
    } catch (error) {
        throw error;
    }
}


// // getAllPublicRoutines
// // select and return an array of public routines, include their activities



// // getAllRoutinesByUser({ username })
// // select and return an array of all routines made by user, include their activities



// // getPublicRoutinesByUser({ username })
// // select and return an array of public routines made by user, include their activities



// // getPublicRoutinesByActivity({ id })
// // select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities


async function createRoutine({
    creatorId,
    isPublic,
    name,
    goal
}) {
    try {
        const { rows: [routine] } = await client.query(`
        INSERT INTO routines("creatorId", "isPublic", "name", "goal") 
        VALUES($1, $2, $3, $4)
        RETURNING *;
      `, [creatorId, isPublic, name, goal]);

        return routine;
    } catch (error) {
        throw error;
    }
}


async function updateRoutine({ id, isPublic, name, goal }) {
    try { // Coalesce = handle null values
        const { rows: [ updatedRoutine ] } = await client.query(`
        UPDATE routines
        SET "isPublic"= Coalesce($1, "isPublic"),
        name= $2,
        goal=$3
        WHERE id=$4
        RETURNING *;
        `, [isPublic, name, goal, id])

        return updatedRoutine
    } catch (error) {
        throw error
    }
}



// // destroyRoutine(id)
// // remove routine from database
// // Make sure to delete all the routine_activities whose routine is the one being deleted.

async function destroyRoutine(id) {
    try {
        const { rows: [ deletedRoutine ] } = await client.query(`
        DELETE FROM routines
        WHERE id=$1
        `, [id])

        const { rows: deletedRoutineActivities } = await client.query(`
        DELETE FROM routine_activities
        WHERE id=$1
        `, [id])

        return deletedRoutine
    } catch (error) {
        throw error
    }
}


module.exports = {
    createRoutine,
    getRoutinesWithoutActivities,
    getRoutineById,
    updateRoutine,
    destroyRoutine,
    getAllRoutines
}