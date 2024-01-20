const router = require("express").Router();
const {
  getCurrentUser,
  addToCollection,
  removeFromCollection,
  getCollection,
} = require("../controllers/users");
const { validateId } = require("../middlewares/validation");

// CRUD

// Create

// Read
router.get("/me", getCurrentUser);
router.get("/recipes", getCollection);

// Edit
router.put("/recipes/:itemId", validateId, addToCollection);
// Delete
router.delete("/recipes/:itemId", validateId, removeFromCollection);

module.exports = router;
