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


app.use('/api/statusUpdate', statusUpdate);
app.use('/api/user', user);



const mongoEndpoint = 'mongodb+srv://diapanx:banana1234@twitter.plh8x.mongodb.net/?retryWrites=true&w=majority&appName=twitter';
mongoose.connect(mongoEndpoint, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});