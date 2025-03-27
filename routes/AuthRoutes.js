const express = require("express");
const {
    getAllUsers,
    createUser,
    getUserByUsername,
    updateUser,
    deleteUser,
} = require("../controllers/UserController");

const router = express.Router();

router.route("/signup").post(createStudent);
router.route("/login").post(login);

module.exports = router;