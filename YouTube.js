const fetch = require("node-fetch")
const endpoint = "https://www.googleapis.com/youtube/v3/"
const moment = require("moment")

module.exports = class YouTube {
  constructor(apiKey) {
    if (!apiKey) throw new Error("An api key is required!")
    this.apiKey = apiKey
    this.count = 0
  }

  async getChannelVideos(channelId) {
    if (!channelId) return null

    // get a playlist id for channel

    // get all videos in playlist
    const queryParams = {
      part: "snippet",
      playlistId: "UU_A--fhX5gea0i4UtpD99Gg",
      key: this.apiKey,
      maxResults: 50
    }

    try {
      return await this._recursiveExec(queryParams)
    } catch (error) {
      // bubble up errors
      throw error
    }
  }

  // recursively traverse google api until next page token is null
  async _recursiveExec(queryParams) {
    // make request
    const result = await this._execQuery(queryParams)

    if (result.next) {
      // make another request and append to previous results
      return result.data.concat(
        await this._recursiveExec({ ...queryParams, pageToken: result.next })
      )
    } else {
      // bubble up errors
      return result.data
    }
  }

  async _execQuery(queryParams) {
    const query = this._buildQueryString("playlistItems", queryParams)

    try {
      const result = await fetch(query)
      const json = await result.json()

      // this.count++
      // console.log({ [this.count]: json.nextPageToken })

      return {
        data: this._formatPlaylistResults(json),
        next: json.nextPageToken || null
      }
    } catch (error) {
      throw error
    }
  }

  // create a request url with query params
  _buildQueryString(apiType, queryParams) {
    const queryParamsString = Object.entries(queryParams).reduce(
      (acc, [key, value], idx) => {
        if (idx > 0) {
          acc += "&"
        }

        return acc + `${key}=${value}`
      },
      `${apiType}?`
    )

    return endpoint + queryParamsString
  }

  _formatPlaylistResults(jsonResults) {
    return jsonResults.items.map(res => [
      res.snippet.resourceId.videoId,
      res.snippet.title,
      moment(res.snippet.publishedAt).format("YYYY-MM-DD HH:MM:SS")
    ])
  }
}
