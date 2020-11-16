const app = require("express")()
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require("./routes"))

app.listen(process.env.PORT || 3000, () => console.log("rodando server"))
