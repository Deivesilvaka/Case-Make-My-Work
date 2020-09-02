const google = require("googleapis").google
const customSearch = google.customsearch("v1")
const state = require("../robots/state")

const googleCreadentials = require("../credentials/googleSeach.json")

async function robot(content) {

    console.log(`> [Image-Robot]: Acabei de receber todo o conteudo de ${content.searchTerm} para pesquisar`)

    await fetchImagesOfAllSentences(content)

    state.save(content, `./src/content/${content.searchTerm}.json`)

    async function fetchImagesOfAllSentences(content) {
        for(const sentence of content.sentences) {
            let query = `${content.searchTerm} ${sentence.keywords[0]}`
            sentence.images = await fetchGoogleAndReturnImagesArray(query)
            sentence.googleSearchQuery = query
        }
    }

    async function fetchGoogleAndReturnImagesArray(query) {

        const response = await customSearch.cse.list({
            auth: googleCreadentials.apikey,
            cx: googleCreadentials.searchEngineId,
            searchType: "image",
            imgSize: "huge",
            q: query,
            num: 2
        })

        const imagesUrl = response.data.items.map((item) => {
            return item.link
        })

        return imagesUrl
    }

}

module.exports = robot