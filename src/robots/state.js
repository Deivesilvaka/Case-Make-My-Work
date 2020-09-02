
const fs = require("fs")

function save(content, Path) {
    const contentFilePath = Path
    const contentString = JSON.stringify(content)
    return fs.writeFileSync(contentFilePath, contentString)
}

function load(Path) {
    const contentFilePath = Path
    const fileBuffer = fs.readFileSync(contentFilePath, "utf-8")
    const contentJson = JSON.parse(fileBuffer)
    return contentJson
}

module.exports = {
    save,
    load
}