const { promisify } = require("util")
const mysql = require("mysql")
const fs = require("fs").promises

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  multipleStatements: true
})

connection.connect(err => {
  if (err) {
    console.error(err)
  }

  // create database if not exist
  createDb()
    .then(() => {
      // switch to database
      connection.changeUser({ database: process.env.MYSQL_DATABASE }, err => {
        if (err) {
          console.error(err)
        }
      })

      console.log(
        "Successfully switched database to " + process.env.MYSQL_DATABASE
      )
    })
    .catch(err => {
      console.log(err)
      process.exit(1)
    })

  console.log("Connected as thread id: " + connection.threadId)
})

const query = promisify(connection.query).bind(connection)

const createDb = async () => {
  try {
    // load sql file
    const sql = await fs.readFile("./data/youtube.sql")

    // create database/tables form sql file
    return await query(sql.toString())
  } catch (err) {
    throw error
  }
}

module.exports = {
  connection,
  query
}
