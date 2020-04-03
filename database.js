require("dotenv").config()
const { promisify } = require("util")
const mysql = require("mysql")
const fs = require("fs").promises

const connection = mysql.createConnection({
  host: "35.224.4.167",
  user: "playsports",
  password: "initd33p",
  multipleStatements: true
})

connection.connect(err => {
  if (err) {
    console.error(err)
  }

  // create database if not exist
  createDb()

  // switch to database
  connection.changeUser({ database: process.env.MYSQL_DATABASE }, err => {
    if (err) {
      console.error(err)
    }

    console.log(
      "Successfully switched database to " + process.env.MYSQL_DATABASE
    )
  })

  console.log("Connected as thread id: " + connection.threadId)
})

const query = promisify(connection.query).bind(connection)

const createDb = async () => {
  try {
    // load sql file
    const sql = await fs.readFile("./data/youtube.sql")

    // create database
    const res = await query(sql.toString())

    // console.log(res)
  } catch (err) {
    throw error
  }
}

module.exports = {
  connection,
  query
}
