const express = require("express");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors')

const app = express();
dotenv.config();
const port = process.env.PORT || 3001;

app.use(cors({origin: `http://localhost:${port}`, credentials: true}));
app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/AuthRoutes");
app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

const mongoose = require("mongoose");
const queryUsers = process.env.MONGODB_USERS_URI;

//configure mongoose
const userDB = mongoose.connect(queryUsers, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('User MongoDB connected!'))
    .catch(err => console.log('User MongoDB connection error:', err.message));