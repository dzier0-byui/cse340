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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect
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
  const { classification_name } = req.body 

  const addResult = await invModel.addClassification(classification_name)

  let nav = await utilities.getNav()

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

invCont.buildNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const dropdown = await utilities.buildClassificationList()
  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    dropdown,
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_price: null,
    inv_year: null,
    inv_miles: null,
    inv_color: ""
  })
}

invCont.addVehicle = async function (req, res) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body 

  const addResult = await invModel.addVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  let nav = await utilities.getNav()
  const dropdown = await utilities.buildClassificationList()

  if (addResult){
    req.flash(
      "notice",
      `Congratulations, you added ${inv_year} ${inv_make} ${inv_model}.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, adding vehicle failed.")
    req.status(501).render("./inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      dropdown,
      inv_make,
      inv_model,
      inv_description,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


module.exports = invCont