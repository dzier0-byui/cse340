const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

//classification validation rules
validate.classificationRules = () => {
    return [
        body("classification_name")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Name is required.")
          .isAlpha()
          .withMessage("Please enter a name with only alphabetic characters.")
    ];
}

//check data and return errors or continue inserting data 
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors})
        return
    }
    next()
}

module.exports = validate