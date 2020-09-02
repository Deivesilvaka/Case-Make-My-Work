
const state = require("../robots/state")
const algorithmia = require("algorithmia")
const {algorithmiaKey} = require("../credentials/keys.json")
const watsonApiKey = require("../credentials/watson-credentials.json").apikey
const sentenceBoundaryDetection = require("sbd")

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey:watsonApiKey,
    version:'2019-07-12',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

async function robot(content) {
    
    console.log(`> [Text-Robot]: Recebi o conteudo para pesquisar sobre ${content.prefix} ${content.searchTerm}`)
    await fetchContentFromWikipedia(content)
    await sanitizeContent(content)
    await breakContentIntoSentences(content)
    await fetchKeyWordsOfAllSentences(content)
    
    return content
    //state.save(content, `./src/content/${content.searchTerm}.json`)

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

    async function fetchKeyWordsOfAllSentences(content) {
        for(const sentence of content.sentences) {
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
        }
    }

    async function fetchWatsonAndReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
          nlu.analyze({
            text: sentence,
            features: {
              keywords: {}
            }
          }, (error, response) => {
            if (error) {
              reject(error)
              return
            }
    
            const keywords = response.keywords.map((keyword) => {
              return keyword.text
            })
    
            resolve(keywords)
          })
        })
      }

}

module.exports = robot