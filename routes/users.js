const router = require("express").Router();
const {
  getCurrentUser,
  addToCollection,
  removeFromCollection,
  getCollection,
} = require("../controllers/users");

// CRUD

// Create

// Read
router.get("/me", getCurrentUser);
router.get("/recipes", getCollection);

// Edit
router.put("/recipes/:itemId", addToCollection);
// Delete
router.delete("/recipes/:itemId", removeFromCollection);

module.exports = router;
