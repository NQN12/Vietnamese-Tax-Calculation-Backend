const express = require("express");
const {
    getAllUsers,
    createUser,
    login,
    logout
} = require("../controllers/UserController");

const router = express.Router();

router.route("/").get(getAllUsers); // for debugging purposes
router.route("/signup").post(createUser); // done
router.route("/login").post(login); // done
router.route("/logout").post(logout); // done

/* Can implement if time permits
router.route("/changePassword").post(changePassword);
router.route("/recoverPassword").post(recoverPassword);
*/
module.exports = router;