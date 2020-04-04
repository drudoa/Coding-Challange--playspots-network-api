require("dotenv").config()
const express = require("express")
const { query } = require("./database")
const YouTube = require("./YouTube")

const app = express()

const port = process.env.PORT || 3000

const state = {
  isPopulating: false,
  error: null
}

const channels = [
  {
    name: "GlobalCyclingNetwork",
    id: "UCuTaETsuCOkJ0H_GAztWt0Q",
    playlistId: "UUuTaETsuCOkJ0H_GAztWt0Q"
  },
  {
    name: "globalmtb",
    id: "UC_A--fhX5gea0i4UtpD99Gg",
    playlistId: "UU_A--fhX5gea0i4UtpD99Gg"
  }
]

//  search YouTube for matching videos and store in db.
app.get("/api/videos/populate", (req, res) => {
  if (state.isPopulating === true) {
    // a request is already running
    return res
      .status(429)
      .json({ message: "Database is currently being updated!" })
  }

  // reset error state
  state.error = null
  state.isPopulating = true

  const api = new YouTube(process.env.YOUTUBE_API_KEY)

  console.log("starting database population")

  // clear the vidoes table in db
  query("TRUNCATE TABLE `videos`").catch(err => console.error(err))

  // this method is recursive and will take some time
  channels.forEach(channel => {
    api
      .getChannelVideos(channel.playlistId)
      .then(data => {
        // put results into database
        const sql = "INSERT INTO `videos` (id, title, date) VALUES ?"
        return query(sql, [data])
      })
      .catch(err => {
        console.error(err.message)
        state.error = err.message
      })
      .finally(() => {
        state.isPopulating = false
        console.log("database population finnished")
      })
  })

  return res.json({
    message:
      "Database is now updating and may take some time to complete, please check back again later"
  })
})

app.get("/api/videos/populate/status", (req, res) => {
  if (state.isPopulating === true) {
    return res.json({ message: "Database is currently being updated!" })
  } else if (state.error !== null) {
    return res.json({ error: state.error })
  }
})

// gets all stored videos
app.get("/api/videos", (req, res) => {
  const sql =
    "SELECT COUNT(*) AS totalVideos FROM `videos`;SELECT * FROM `videos` LIMIT 100"
  query(sql)
    .then(data =>
      res.json({
        total: data[0][0].totalVideos,
        videos: data[1]
      })
    )
    .catch(err => res.status(500).json({ error: err }))
})

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
