const express = require("express");
const {
    getAllUsers,
    createUser,
    getUserByUsername,
    updateUser,
    deleteUser,
} = require("../controllers/UserController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(createUser);
// router.route("/login").post(login);

module.exports = router;