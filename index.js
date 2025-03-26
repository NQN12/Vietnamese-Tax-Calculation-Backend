const express = require("express");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors')

const app = express();

app.use(cors({origin: 'http://localhost:3001', credentials: true}));
app.use(cookieParser());
app.use(express.json());
dotenv.config();

const authRouter = require("./routes/AuthRoutes");
app.use("/auth", authRouter);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

module.exports = app;

const mongoose = require("mongoose");
const queryString = process.env.MONGODB_USERS_URI || "mongodb+srv://dobalam:dobalam-it4409@lamdb-it4409.ybiwz.mongodb.net/College?retryWrites=true&w=majority&appName=lamdb-it4409";

//configure mongoose
mongoose.connect(queryString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!'))
    .catch(err => console.log('MongoDB connection error:', err.message));