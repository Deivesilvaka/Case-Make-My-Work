const routes = require("express").Router()
const initialController = require("./src/controllers/initialController")

routes.get("/init", initialController.start)
routes.post("/initMobile", initialController.Start)

routes.get("/", (req, res) => {
    return res.json({message:"ok"})
})

module.exports = routes