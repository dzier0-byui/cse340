const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

//classification validation rules
validate.vehicleRules = () => {
    const currentYear = new Date().getFullYear();

    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Classification needs to be selected."),

        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required.")
            .isLength({ min: 3 })
            .withMessage("Make must be at least 3 characters long."),

        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required.")
            .isLength({ min: 3 })
            .withMessage("Model must be at least 3 characters long."),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required."),

        body("inv_price")
            .notEmpty()
            .withMessage("Price is required.")
            .isFloat({ gt: 0 })
            .withMessage("Price must be a positive number."),

        body("inv_year")
            .notEmpty()
            .withMessage("Year is required.")
            .isInt({ min: 1886, max: currentYear + 1 })
            .withMessage(`Year must be between 1886 and ${currentYear + 1}.`),

        body("inv_miles")
            .notEmpty()
            .withMessage("Miles is required.")
            .isInt({ min: 0 })
            .withMessage("Miles must be a positive integer."),

        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required.")
            .isAlpha()
            .withMessage("Color must contain only alphabetic characters."),

        body("inv_image")
            .notEmpty()
            .withMessage("Image path is required.")
            .matches(/^\/images\/vehicles\/[\w\-]+\.(png|jpg|jpeg|gif)$/i)
            .withMessage("Image path must start with '/images/vehicles/' and end in a valid image format."),
        
        body("inv_thumbnail")
            .notEmpty()
            .withMessage("Thumbnail path is required.")
            .matches(/^\/images\/vehicles\/[\w\-]+\.(png|jpg|jpeg|gif)$/i)
            .withMessage("Thumbnail path must start with '/images/vehicles/' and end in a valid image format.")
    ];
}

//check data and return errors or continue inserting data 
validate.checkVehicleData = async (req, res, next) => {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        inv_image,
        inv_thumbnail
    } = req.body;

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const dropdown = await utilities.buildClassificationList(classification_id)
        res.render("./inventory/add-vehicle", {
            title: "Add New Vehicle",
            nav,
            errors,
            dropdown,
            inv_make,
            inv_model,
            inv_description,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

module.exports = validate