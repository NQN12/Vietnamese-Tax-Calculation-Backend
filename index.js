const express = require("express");
const authRouter = require("./routes/AuthRoutes");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors')

const app = express();
dotenv.config();
const port = process.env.PORT || 3001;

app.use(cors({origin: `http://localhost:5173`, credentials: true}));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

const mongoose = require("mongoose");
const queryUsers = process.env.MONGODB_UScorERS_URI;

//configure mongoose
const userDB = mongoose.connect(queryUsers, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('User MongoDB connected!'))
    .catch(err => console.log('User MongoDB connection error:', err.message));

// Middleware for accessing to others services
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}