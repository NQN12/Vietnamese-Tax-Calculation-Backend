const UserModel = require('../models/RegisteredUser');

const dotenv = require('dotenv');
dotenv.config();

// imports to allow authentication
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// function to getAllUsers from the database 
// should be called by ???
exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        console.log("All users: ", users);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({data: users, status: "success"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// function to createUser in the database
// can be called by anyone 
// should avoid bot attacks => use captcha
// all response messages should be generic after deployment
// how many usernames/accounts can be created per email?
exports.createUser = async (req, res) => {
    try {
        const {username:_username, email: _email, password: _password} = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ username: _username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists", status: "error" });
        }
        
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(_password, salt);

        // Save user to database
        const user = new UserModel({
            username: _username,
            email: _email,
            password: hashedPassword
        });
        const newUser = await user.save();
        // console.log("New user created: ", newUser);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ data: newUser, status: "User successfully registered" }); // Does this need to include data field in response?
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await UserModel.findOne({username : username});
        if (user == null) {
            return res.status(400).json({ message: `Wrong username`, status: "error" }); // For security purposes, do not specify the error message
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password", status: "error" });
        }

        // Generate token
        const accessToken = jwt.sign(
            { id: user._id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
            { id: user._id }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: "1d" }
        );

        // Set cookie marked as httpOnly 
        // => protect against XSS (Cross-Site Scripting) attacks
        res.cookie(
            "jwt", 
            refreshToken, 
            { 
                httpOnly: true, 
                sameSite: "None", 
                maxAge: 3 * 24 * 60 * 60 
            }
        ); 
        res.json({accessToken, message: "User successfully logged in", status: "success"});
        // res.setHeader('Access-Control-Allow-Origin', '*');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.logout = async (req, res) => {
    try {
        console.log("Clearing cookie...");
        // Clear the cookie
        res.clearCookie(
            "jwt",
            { 
                httpOnly: true, 
                sameSite: "None", 
            }
        );
        console.log("Cookie cleared");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ message: "User successfully logged out", status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await UserModel.findOne({email: email});
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
            res.status(400).json({ message: `Cannot find username ${username}}`, status: "error" });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(username, user);
        res.json({ data: updatedUser, status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const username = req.params.username;
        await UserModel.findByIdAndDelete(username);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}