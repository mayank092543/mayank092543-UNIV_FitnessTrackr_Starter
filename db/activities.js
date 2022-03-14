// const { Client } = require('pg');

const client = require("./client");

// const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/fitness-dev';
// const activityClient = new Client(CONNECTION_STRING);

// getActivityById(id)
// return the activity



// getAllActivities
// select and return an array of all activities
async function getAllActivities() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM activities;
        `);

        return rows;
    } catch (error) {
        throw error;
    }
}


// createActivity({ name, description })
// return the new activity
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


// updateActivity({ id, name, description })
// don't try to update the id
// do update the name and description
// return the updated activity



module.exports = {
    // activityClient,
    createActivity,
    getAllActivities
}