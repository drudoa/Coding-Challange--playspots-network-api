const fs = require("fs").promises
const file = "./search_filter"

const loadTerms = async () => {
  // load search filter terms into an array
  const string = await (await fs.readFile(file)).toString()
  const terms = string.split("\n")

  return `/${terms.join("|")}/g`
}

const filterArray = async array => {
  const regex = await loadTerms()

  // find any matches in title coloumn and filter from results
  return array.filter(row => {
    const matches = row[1].match(`/${regex}/g`)
    return !matches
  })
}

module.exports = filterArray
