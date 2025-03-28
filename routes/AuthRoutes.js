const express = require("express");
const {
    getAllUsers,
    createUser,
    getUserByUsername,
    updateUser,
    deleteUser,
} = require("../controllers/UserController");

const router = express.Router();

router.route("/").get(getAllUsers); // for debugging purposes
router.route("/signup").post(createUser); // done
router.route("/login").post(login); // to do
router.route("/logout").post(logout); // to do

/* Can implement if time permits
router.route("/changePassword").post(changePassword);
router.route("/recoverPassword").post(recoverPassword);
*/
module.exports = router;