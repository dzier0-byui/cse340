const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryItemId = async function (req, res, next) {
  const item_id = req.params.itemId
  const data = await invModel.getInventoryItemById(item_id)
  const grid = await utilities.buildInventoryItemGrid(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/details", {
    title: vehicleName,
    nav,
    grid,
  })
}

invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body 

  const addResult = await invModel.addClassification(classification_name)

  if (addResult){
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name}.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, adding classification failed.")
    req.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
}

module.exports = invCont