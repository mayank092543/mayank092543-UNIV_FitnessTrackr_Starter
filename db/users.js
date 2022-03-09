const { Client } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:1108/fitness-dev';
const userClient = new Client(CONNECTION_STRING);

async function createUser({ username, password }) {
    try {
        const { rows: [user] } = await userClient.query(`
        INSERT INTO users(username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password]);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        // remove the password from the returned row
        const returnedUser = user;
        returnedUser.password = '';
        console.log(returnedUser.password);


        return returnedUser;
    } catch (error) {
        throw error;
    }
}



module.exports = {
    userClient,
    createUser
}