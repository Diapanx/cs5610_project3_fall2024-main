const express = require('express');
const helper = require('./helper');
const statusUpdate = require('./route/statusUpdate.route');
const user = require('./route/user.route');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const cors = require('cors');
// app.use(cors({
//     origin: 'http://localhost:5173', // Frontend origin
//     credentials: true // Allow cookies
// }));

app.use('/api/statusUpdate', statusUpdate);
app.use('/api/user', user);



const mongoEndpoint = 'mongodb+srv://diapanx:banana1234@twitter.plh8x.mongodb.net/?retryWrites=true&w=majority&appName=twitter';
mongoose.connect(mongoEndpoint, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.listen(3000, function() {
    console.log('Server started');
})