const routes = require("express").Router()
const initialController = require("./src/controllers/initialController")

routes.post("/init", initialController.start)
routes.post("/initMobile", initialController.Start)

module.exports = routes