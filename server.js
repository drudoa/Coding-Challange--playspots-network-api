require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const { query } = require("./database")
const YouTube = require("./YouTube")
const searchFilter = require("./helpers/filter")

const app = express()

const port = process.env.PORT || 3000

const state = {
  isPopulating: false,
  error: null
}

// TODO: move channel info to database
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

app.use(bodyParser.json())

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

  channels.forEach(channel => {
    // this method is recursive and will take some time
    api
      .getChannelVideos(channel.playlistId)
      .then(async data => {
        // filter data by search_filter file
        const filtered = await searchFilter(data)

        // put results into database
        const sql = "INSERT INTO `videos` (id, title, date) VALUES ?"
        return query(sql, [filtered])
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
app.get("/api/videos/:id", (req, res) => {
  if (!req.params.id) return res.status(400).json({ message: "invalid id" })

  const sql = "SELECT * FROM `videos` WHERE `id` = ?"
  query(sql, req.params.id)
    .then(data => res.json({ result: data[0] }))
    .catch(err => res.status(500).json({ error: err }))
})

// find a stored video by search term
app.post("/api/videos", (req, res) => {
  if (!req.body.searchTerm)
    return res.status(400).json({ message: "invalid search term" })

  const sql =
    "SELECT id, title FROM `videos` WHERE MATCH (title) AGAINST (? IN NATURAL LANGUAGE MODE)"
  query(sql, req.body.searchTerm)
    .then(data => res.json({ total: data.length, results: data }))
    .catch(err => res.status(500).json({ error: err }))
})

// removes a stored video by id
app.delete("/api/videos/:id", (req, res) => {
  if (!req.params.id) return res.status(400).json({ message: "invalid id" })

  const sql = "DELETE FROM `videos` WHERE `id` = ?"
  query(sql, req.params.id)
    .then(data => res.json({ message: `Video ${req.params.id} deleted.` }))
    .catch(err => res.status(500).json({ error: err }))
})

app.listen(port, () => {
  console.log(`App listening on port: ${port}`)
})
