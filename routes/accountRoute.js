// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

//login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//register user
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router;