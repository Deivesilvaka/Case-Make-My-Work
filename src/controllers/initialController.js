const state = require("../robots/state")

const robots = {
    Text:require("../robots/text"),
    state:require("../robots/state")
}

module.exports = {

    async start(req, res) {

        let content = {}

        content.searchTerm = req.body.searchTerm
        content.prefix = req.body.prefix
        content.lang = req.body.lang

        try{
            console.log("conteudo existe")
            content = state.load(`./src/content/${content.searchTerm}.json`)
        }catch{
            console.log("conteudo não existe")
            await robots.Text(content)
        }

        return res.json(content)
    }

}