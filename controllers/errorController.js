const errorCont = {}

errorCont.buildIntentionalError = async function (req, res, next) {
    res.render("index", {title: "Error", nav})
}

module.exports = errorCont
  