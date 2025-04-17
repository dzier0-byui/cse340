const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewCont = {}


reviewCont.buildAddReview = async function (req, res, next) {

    const inv_id = req.params.inv_id
    const invData = await invModel.getInventoryItemById(inv_id)

    let nav = await utilities.getNav()
    res.render("./review/create-review", {
      title: `Add Review For ${invData[0].inv_year} ${invData[0].inv_make} ${invData[0].inv_model}`,
      nav,
      errors: null,
      inv_id: inv_id,
      review_text: ""
    })
}

reviewCont.insertReview = async function (req, res, next) {
    const {review_text, inv_id, account_id} = req.body
    
    const addResult = await reviewModel.addReview(review_text, inv_id, account_id)

    const data = await invModel.getInventoryItemById(inv_id)
    const reviews = await reviewModel.getReviewsByInventoryId(inv_id)
    const grid = await utilities.buildInventoryItemGrid(data, reviews, res.locals.loggedin)

    let nav = await utilities.getNav()

    if (addResult){
        req.flash(
          "notice",
          `Review added successfully`
        )
        res.status(201).render("./inventory/details", {
            title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
            nav,
            grid,
          })
      } else {
        req.flash("notice", "Sorry, adding vehicle failed.")
        res.status(501).render("./review/create-review", {
            title: `Add Review For ${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
            nav,
            errors: null,
            inv_id: inv_id,
            review_text: review_text
          })
      }

}

module.exports = reviewCont