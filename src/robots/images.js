const google = require("googleapis").google
const customSearch = google.customsearch("v1")
const state = require("../robots/state")

const googleCreadentials = require("../credentials/googleSeach.json")

async function robot(content) {

    console.log(`\n> [Image-Robot]: Acabei de receber todo o conteudo de ${content.searchTerm} para pesquisar`)

    console.log(`\n> [Image-Robot]: Pesquisando imagens...`)
    await fetchImagesOfAllSentences(content)

    console.log(`\n> [Image-Robot]: Terminei...`)
    state.save(content, `./src/content/${content.searchTerm}.json`)

    async function fetchImagesOfAllSentences(content) {
        for(const sentence of content.sentences) {
            let query = `${content.searchTerm} ${sentence.keywords[Math.floor(Math.random()*sentence.keywords.length)]}`

            console.log(`\n > [Image-Robot]: Vendo o que eu encontro se eu pesquisar po ${query}`)

            sentence.images = await fetchGoogleAndReturnImagesArray(query)

            sentence.googleSearchQuery = query
        }
    }

    async function fetchGoogleAndReturnImagesArray(query) {

        const response = await customSearch.cse.list({
            auth: googleCreadentials.apikey,
            cx: googleCreadentials.searchEngineId,
            q: query,
            searchType: "image",
            //imgSize: "huge",
            num: 4
        })

        const imagesUrl = response.data.items.map((item) => {
            return item.link
        })

        return imagesUrl
    }

}

module.exports = robot