// require and re-export all files in this db directory (users, activities...)
const {
    userClient,
    createUser
} = require('./users.js');

const {
    activityClient,
    createActivity
} = require('./activities.js');


module.exports = {
    userClient,
    activityClient,
    createUser,
    createActivity
}