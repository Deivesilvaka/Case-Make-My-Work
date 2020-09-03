const app = require("express")()
const bodyParser = require("body-parser")

app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); next(); });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require("./routes"))

app.listen(3000, () => console.log("rodando server"))
