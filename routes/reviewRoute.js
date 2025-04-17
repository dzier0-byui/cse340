// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")
const reviewValidate = require('../utilities/review-validation')

//add review view
router.get("/add-review/:inv_id", utilities.handleErrors(reviewController.buildAddReview))

router.post("/add-review",
    utilities.checkLogin,
    reviewValidate.reviewRules(),
    reviewValidate.reviewData,
    utilities.handleErrors(reviewController.insertReview))

module.exports = router