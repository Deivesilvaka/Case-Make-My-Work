
const algorithmia = require("algorithmia")
const {algorithmiaKey} = require("../credentials/keys.json")
const sentenceBoundaryDetection = require("sbd")

async function robot(content) {
    console.log(`> [Text-Robot]: Recebi o conteudo para pesquisar sobre ${content.prefix} ${content.searchTerm}`)
    await fetchContentFromWikipedia(content)
    await sanitizeContent(content)
    await breakContentIntoSentences(content)

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = await algorithmia(algorithmiaKey)
        const wikipediaAlgorithm = await algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2")
        const wikipediaResponse = await wikipediaAlgorithm.pipe({"articleName":content.searchTerm, "lang": content.lang})
        const wikipediaContent = await wikipediaResponse.get()

        content.sorceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent(content) {

        const withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkDown(content.sorceContentOriginal)
        const withoutDatesInParenteses = removeDateInParenteses(withoutBlankLinesAndMarkDown)

        content.sorceContentSanitized = withoutDatesInParenteses

        function removeBlankLinesAndMarkDown(text) {

            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkDown = allLines.filter((line) => {
                if(line.trim().length === 0 || line.trim().startsWith('=')){
                    return false
                }
                return true
            })

            return withoutBlankLinesAndMarkDown.join(' ')
        }

        function removeDateInParenteses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }

    }

    function breakContentIntoSentences(content) {

        content.sentences = []

        const sentences = sentenceBoundaryDetection.sentences(content.sorceContentSanitized)
        
        for(let sentence = 0; sentence <= 10; sentence++){
            content.sentences[sentence] = {
                text:sentences[sentence],
                keywords: [],
                images: []
            }
        }
    }

}

module.exports = robot