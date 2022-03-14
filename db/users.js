// const { Client } = require('pg');
const client = require("./client");
const bcrypt = require("bcrypt");

// const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/fitness-dev';
// const userClient = new Client(CONNECTION_STRING);


// createUser({ username, password })
// make sure to hash the password before storing it to the database
async function createUser({ username, password }) {
    // const SALT_COUNT = 10;

    // bcrypt.hash(password, SALT_COUNT, function(err, hashedPassword) {
    //     createUser({
    //         username,
    //         password: hashedPassword // not the plaintext
    //     });
    // });

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


// getUser({ username, password })
// this should be able to verify the password against the hashed password
async function getUser({ username, password }) {
    const user = await getUserByUserName(username);
    const hashedPassword = user.password;

    bcrypt.compare(password, hashedPassword, function(err, passwordsMatch) {
        if (passwordsMatch) {
            // remove the password from the returned row
            const returnedUser = user;
            returnedUser.password = '';
            console.log(returnedUser.password);

            return returnedUser;
        } else {
            throw new Error("Passwords do not match");
        }
    });

}


// getUserById(id)
// select a user using the user's ID. Return the user object.
// do NOT return the password
async function getUserById(id) {
    try {
        const { rows: [user] } = await userClient.query(`
        SELECT id, username, password
        FROM users
        WHERE id=${ id }
      `);

        if (!user) {
            return null
        }

        const noPwUser = user;
        delete noPwUser.password;

        return noPwUser;
    } catch (error) {
        throw error;
    }
}

// getUserByUsername(username)
// select a user using the user's username. Return the user object.
async function getUserbyUsername(username) {
    try {
        const { rows: [user] } = await userClient.query(`
            SELECT *
            FROM users
            WHERE username=$1;
        `, [username]);

        return user;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getUser,
    createUser,
    getUserById,
    getUserbyUsername
}