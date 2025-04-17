// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classificationValidate = require('../utilities/classification-validation')
const vehicleValidate = require('../utilities/vehicle-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory item view
router.get("/detail/:itemId", utilities.handleErrors(invController.buildByInventoryItemId))

router.get("/", utilities.handleErrors(invController.buildVehicleManagement))

router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification))

router.get("/add-vehicle", utilities.handleErrors(invController.buildNewVehicle))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:itemId", utilities.handleErrors(invController.editInventoryView))

router.get("/delete/:itemId", utilities.handleErrors(invController.buildDeleteView))

router.post(
    "/classification",
    classificationValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  )

router.post(
    "/vehicle",
    vehicleValidate.vehicleRules(),
    vehicleValidate.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
)

router.post(
  "/update",
  vehicleValidate.vehicleRules(),
  vehicleValidate.checkUpdateData,
  utilities.handleErrors(invController.updateVehicle)

)

router.post(
  "/delete",
  utilities.handleErrors(invController.deleteVehicle)
)

module.exports = router;
