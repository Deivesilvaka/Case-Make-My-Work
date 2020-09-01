module.exports = {

    async start(req, res) {

        const content = {}

        content.searchTerm = req.body.searchTerm
        content.prefix = req.body.prefix

        return res.json(content)
    }

}