// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")

router.get("/", (req, res, next) => {
    next(new Error("Intentional error for testing"))
})

module.exports = router;