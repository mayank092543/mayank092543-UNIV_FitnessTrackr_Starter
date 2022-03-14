// build and export your unconnected client here
const { Client } = require('pg');
// const connection = process.env.DATABASE_URL || 'http://localhost:5432/fitness-dev';
const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/fitness-dev';
const client = new Client(CONNECTION_STRING);

module.exports = client;