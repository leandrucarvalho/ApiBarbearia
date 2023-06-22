const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BarbeariaDomRamon",
  password: "231795#BdR@",
  port: 5432,
});

module.exports = pool;
