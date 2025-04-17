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

router.get("/logout", utilities.handleErrors(accountController.logout))

//account view
router.get("/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement))

router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateAccount))

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

router.post(
  "/edit",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

  
module.exports = router;