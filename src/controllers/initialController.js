const state = require("../robots/state")

const robots = {
    Text:require("../robots/text"),
    state:require("../robots/state"),
    Images: require("../robots/images")
}

module.exports = {

    async start(req, res) {

        let content = {}

        content.searchTerm = req.body.searchTerm
        content.prefix = req.body.prefix
        content.lang = req.body.lang

        try{
            content = state.load(`./src/content/${content.searchTerm}.json`)
            await robots.Images(content)
        }catch{
            await robots.Text(content)
            await robots.Images(content)
        }

        return res.json(content)
    }

}