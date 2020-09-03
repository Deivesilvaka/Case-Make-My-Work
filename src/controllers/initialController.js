const state = require("../robots/state")

const robots = {
    Text:require("../robots/text"),
    state:require("../robots/state"),
    Images: require("../robots/images")
}

module.exports = {

    async start(req, res) {

        let content = {}

        content.searchTerm = req.query.searchTerm
        content.prefix = req.query.prefix
        content.lang = req.query.lang

        try{
            content = state.load(`./src/content/${content.searchTerm}.json`)
        }catch(err){
            content = await robots.Text(content)
            await robots.Images(content)
        }

        console.log(`\n > [Orquestrador]: Retornando dados...`)
        return res.json(content)
    }

}