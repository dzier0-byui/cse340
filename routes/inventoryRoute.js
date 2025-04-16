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

router.post(
    "/classification",
    classificationValidate.classificationRules(),
    classificationValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  )

router.post(
    "/vehicle",
    vehicleValidate.vehicleRules(),
    vehicleValidate.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)    
)

module.exports = router;
