const fetch = require("node-fetch")
const endpoint = "https://www.googleapis.com/youtube/v3/"

const orderTypes = {
  DATE: "date",
  RATING: "rating",
  RELEVANCE: "relevance",
  TITLE: "title",
  VIEWS: "viewCount"
}

const maxDefault = 5

module.exports = class YouTube {
  constructor(apiKey) {
    if (!apiKey) throw new Error("An api key is required!")
    this.apiKey = apiKey
    this.order = orderTypes.DATE
    this.maxResults = maxDefault
  }

  // note youtube api has a max result of 50, this param will make multiple api calls until this limit is hit or quota reached
  set setMaxResults(value) {
    if (Number.isInteger(value)) {
      this.maxResults = value
    }
  }

  async getChannelVideos(channelId, options = null) {
    if (!channelId) return null

    // validate any options
    if (typeof options === "array") {
      this.maxResults = options.maxResults || maxDefault

      if (options.order) {
        if (orderTypes.hasOwnProperty(options.order)) {
          this.order = options.order
        } else {
          throw new Error("Invalid order type")
        }
      }
    }

    try {
      const query = await fetch(this._buildQueryString(channelId))
      const result = await query.json()

      return this._formatResults(result)
    } catch (error) {
      throw error
    }
  }

  // create a request url with query params for channel
  _buildQueryString(channelId) {
    const queryParams = {
      type: "video",
      order: this.order,
      part: "snippet",
      channelId,
      key: this.apiKey,
      maxResults: this.maxResults
    }

    const queryParamsString = Object.entries(queryParams).reduce(
      (acc, [key, value], idx) => {
        if (idx > 0) {
          acc += "&"
        }

        return acc + `${key}=${value}`
      },
      "search?"
    )

    return endpoint + queryParamsString
  }

  _formatResults(jsonResults) {
    return jsonResults.items.map(res => ({
      videoId: res.id.videoId,
      title: res.snippet.title,
      publishedAt: res.snippet.publishedAt
    }))
  }
}
