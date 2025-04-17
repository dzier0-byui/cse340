const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

//review validation rules
validate.reviewRules = () => {

    return [

        body("review_text")
            .trim()
            .notEmpty()
            .withMessage("Review can't be empty.")
        ];
}

//check data and return errors or continue inserting data 
validate.reviewData = async (req, res, next) => {
    const {
        review_text,
        inv_id,
        account_id
    } = req.body;

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const data = await invModel.getInventoryItemById(inv_id)
        res.render("./review/create-review", {
            title: `Add Review For ${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
            nav,
            errors,
            inv_id: inv_id,
            review_text: review_text
          })
        return
    }
    next()
}

module.exports = validate