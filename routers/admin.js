const express = require("express");
const {getAccessToRoute, getAdminAccess} = require("../middlewares/authorization/auth");
const {blockUser, deleteUser} = require("../controllers/admin");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers");
// Block User
// Delete User
const router = express.Router();

// All routes use that
router.use([getAccessToRoute, getAdminAccess]);

router.get("/block/:id", checkUserExist, blockUser);
router.delete("/user/:id", checkUserExist, deleteUser);

module.exports = router;