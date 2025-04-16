// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

//login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//account view
router.get("/", utilities.handleErrors(accountController.buildAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  //regValidate.loginRules(),
  //regValidate.checkLoginData,
  accountController.accountLogin
)
  
module.exports = router;