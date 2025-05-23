const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()

  console.log(data)

  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory item view
* ************************************ */
Util.buildInventoryItemGrid = async function(data, reviews, loggedIn) {
  let grid = ""
  if (data.length > 0) {
    const vehicle = data[0] // Assuming only one vehicle for detail view
    grid = `
      <div id="inv-item-display">
        <div class="inv-image">
          <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </div>
        <div class="inv-details">
          <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
          <p class="detail-item"><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
          <p class="detail-item shadow"><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>
          <p class="detail-item"><strong>Color:</strong> ${vehicle.inv_color}</p>
          <p class="detail-item shadow"><strong>Description:</strong> ${vehicle.inv_description}</p>
        </div>
      </div>
    `

    grid += `
      <div class="review-section">
        <div class="review-header">
          <h3>Car Reviews</h3>
          ${
            loggedIn
              ? `<p><a href="/review/add-review/${vehicle.inv_id}">Add Review</a></p>`
              : `<p><a href="/account/login">Log in to add a review</a></p>`
          }
        </div>
        ${reviews.length > 0 ? `
          <ul class="review-list">
            ${reviews.map(r => `<li><strong>${r.account_firstname}:</strong> ${r.review_text}</li>`).join("")}
          </ul>
        ` : `<p>No reviews yet.`}
      </div>`
  } else {
    grid += '<p class="notice">Sorry, the vehicle could not be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }
 
 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Only allow access for Employee or Admin users
 * ************************************ */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  const accountData = res.locals.accountData

  if (
    res.locals.loggedin &&
    accountData &&
    (accountData.account_type === "Employee" || accountData.account_type === "Admin")
  ) {
    return next()
  }

  // Not authorized
  req.flash("notice", "You must be logged in as an employee or admin to access that page.")
  res.redirect("/account/login")
}

module.exports = Util