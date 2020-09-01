const robots = {
    Text:require("../robots/text")
}

module.exports = {

    async start(req, res) {

        const content = {}

        content.searchTerm = req.body.searchTerm
        content.prefix = req.body.prefix
        content.lang = req.body.lang

        await robots.Text(content)

        return res.json(content)
    }

}