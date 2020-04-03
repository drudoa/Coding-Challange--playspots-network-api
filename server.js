const express = require("express")
const { query } = require("./database")

const app = express()

const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  query("SELECT * FROM `videos`")
    .then(data => res.json({ message: data }))
    .catch(err => {
      console.error(err)
      res.status("500").json({ message: err }) // TODO: clean up error
    })
})

// search YouTube for matching videos and store in db, returns results
app.put("/api/videos", (req, res) => res.json({ message: "hello world" }))

// gets all stored videos
app.get("/api/videos", (req, res) => res.json({ message: "hello world" }))

// get a stored video by id
app.get("/api/videos/:id", (req, res) => res.json({ message: "hello world" }))

// find a stored video by search term
app.post("/api/videos", (req, res) => res.json({ message: "hello world" }))

// removes a stored video by id
app.delete("/api/videos/:id", (req, res) =>
  res.json({ message: "hello world" })
)

app.listen(port, () => {
  console.log(`App listening on port: ${port}`)
})
