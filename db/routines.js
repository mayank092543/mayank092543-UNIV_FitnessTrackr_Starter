const { Client } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:6991/fitness-dev';
const routineClient = new Client(CONNECTION_STRING);

async function createRoutine({
    creatorId,
    isPublic,
    name,
    goal
}) {
    try {
        const { rows: [routine] } = await routineClient.query(`
        INSERT INTO routines(creatorId, isPublic, name, goal) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (creatorId) DO NOTHING 
        RETURNING *;
      `, [creatorId, isPublic, name, goal]);

        return routine;
    } catch (error) {
        throw error;
    }
}

async function getRoutinesWithoutActivities() {
    try {
        const { rows: [routine] } = await routineClient.query(`
        SELECT *
        FROM routines
        WHERE id=${ userId }
      `);

        if (!user) {
            return null
        }

        user.posts = await getPostsByUser(userId);

        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    routineClient,
    createRoutine
}