const userService = require('../services/UserService');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({data: users, status: "success"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = req.body;
        const newUser = await userService.createUser(user);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ data: newUser, status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await userService.getUserByUsername(username);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ data: user, status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const username = req.params.username;
        const user = req.body;
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (user == null) {
            res.status(400).json({ message: `Cannot find username ${username}}`, status: "error });
        }
        const updatedUser = await userService.updateUser(username, user);
        res.json({ data: updatedUser, status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.deleteUser = async (req, res) => {
    try {
        const username = req.params.username;
        await userService.deleteUser(username);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}