const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const userRoute = require('./routes/user.route.js')

const app = express();

// middleware
app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials:true
    })
);

const store = new MongoDBSession({
    uri: "DB_URI",
    collection: 'sessions'
})
app.use(
    session({
        secret: 'key',
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            maxAge: 60000 * 60 *24,
        }
    })
);

// route
app.use('/api/users', userRoute);


app.get('/', (req, res) => {
    res.send("Hello from Server");
})

mongoose.connect("DB_URI")
    .then(() => {
        console.log("Connected to Database!");
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000/');
        })
    })
    .catch(() => {
        console.log("Connection Failed!");
    });