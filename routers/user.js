const express = require("express");
const {getSingleUser, getAllUsers} = require("../controllers/user")
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers");
const router = express.Router();
const {userQueryMiddleware} = require("../middlewares/query/userQueryMiddleware");
const { model } = require("mongoose");
const User = require("../models/User");

// id ye göre kullanıcı alma
//id dinamik olarak alınacak
router.get("/", userQueryMiddleware(User),getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);


module.exports = router;