const { Client } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:8675/fitness-dev';
const activityClient = new Client(CONNECTION_STRING);

async function createActivity({ name, description }) {

    try {
        const { rows: [activity] } = await activityClient.query(`
        INSERT INTO activities(name, description) 
        VALUES($1, $2) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `, [name, description]);

        return activity;
    } catch (error) {
        throw error;
    }
}



module.exports = {
    activityClient,
    createActivity
}