const pool = require("../database/");

async function getReviewsByInventoryId(inv_id) {
  const sql = `
    SELECT r.review_text, a.account_firstname
    FROM review r
    JOIN account a ON r.account_id = a.account_id
    WHERE r.inv_id = $1
    ORDER BY r.review_id DESC;
  `
  const result = await pool.query(sql, [inv_id])
  return result.rows
}

async function addReview (review_text, inv_id, account_id) {
    try {
        const sql = `INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *`
        return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
        return error.message
    }
}

module.exports = { getReviewsByInventoryId, addReview }