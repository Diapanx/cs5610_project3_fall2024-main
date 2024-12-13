const express = require('express');
const router = express.Router();
const userModel = require('./db/user.model');
const jwtHelpers = require('./helpers/jwt')


router.get('/:username', async function(req, res) {
    // const owner = jwtHelpers.decrypt(req.cookies.userToken);  
    const username = req.params.username;
    // const cookies = req.cookies;
    // console.log("This is my fav user: ", cookies.huntersFavUser);
    try {
        const user = await userModel.findUserByUsername(username);     
        return res.send(user);
    } catch (error) {
        res.status(404)
        res.send("No user with ID " + req.params.username + " found :(");  
    }
})


router.post('/login', async function(request, response) {
    const { username, password } = request.body;

    try {
        const user = await userModel.findUserByUsername(username);

        if (user.length === 0) {
            return response.status(400).send('User not found');
        }
        const retrievedUser = user[0];

        if (retrievedUser.password === password) {
            const token = jwtHelpers.generateToken(username);
            console.log(username)
            console.log('Generated Token:', token);
            response.cookie('userToken', token);
            return response.send('Log in successful');
        } else {
            return response.status(400).send('Invalid password');
        }
    } catch (error) {
        console.error('Login error:', error);
        return response.status(500).send('Internal server error');
    }
})

router.post('/signup', async function(request, response) {

    try {
        const user = await userModel.createUser(request.body);

        response.cookie('userToken', jwtHelpers.generateToken(user.username));
        return response.send('Log in successful');

    } catch (error) {
        response.status(400);
        console.log(error);
        return response.send('Error creating new user');
    }
})

router.post('/logout', function(request, response) {
    response.clearCookie('userToken'); // this doesn't delete the cookie, but expires it immediately
    response.send('Logged out successfully');
})

router.get('/isLoggedIn', function(request, response) {
    console.log('isLoggedIn route called');
    const token = request.cookies.userToken;
    console.log('Received token:', token);
    if (!token) {
        return response.status(401).send('User not logged in');
    }

    const username = jwtHelpers.decrypt(token);
    if (!username) {
        return response.status(401).send('Invalid token');
    }

    console.log('Decrypted username:', username);
    response.send(username);
})

module.exports = router;