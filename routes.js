const routes = require("express").Router()
const initialController = require("./src/controllers/initialController")

routes.post("/init", initialController.start)

module.exports = routes