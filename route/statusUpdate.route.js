const express = require('express');
const router = express.Router();
const statusUpdateModel = require('./db/statusUpdate.model');
const jwtHelpers = require('./helpers/jwt')


// http://localhost:3000/api/post/
router.get('/', async function(req, res) {

    const statusUpdateList = await statusUpdateModel.getAllStatusUpdate();

    res.send(statusUpdateList);

})

// find statusUpdates by user
router.get('/:username', async function(req, res) {

    // const owner = jwtHelpers.decrypt(req.cookies.statusUpdateToken);
    const username = req.params.username;

    const statusUpdateList = await statusUpdateModel.findStatusUpdateByUser(username);

    // res.cookie("huntersFavStatusUpdate", "Pikachu");
    res.send(statusUpdateList);

})

router.get('/:statusUpdateId', async function(req, res) {
    const owner = jwtHelpers.decrypt(req.cookies.statusUpdateToken);  
    const statusUpdateId = req.params.statusUpdateId;
    // const cookies = req.cookies;
    // console.log("This is my fav statusUpdate: ", cookies.huntersFavStatusUpdate);
    try {
        const statusUpdate = await statusUpdateModel.findStatusUpdateById(statusUpdateId);   
        if(statusUpdate.owner !== owner) {
            return res.status(404).send("You do not have permission to access statusUpdate " + req.params.statusUpdateId);
        }      
        return res.send(statusUpdate);
    } catch (error) {
        res.status(404)
        res.send("No statusUpdate with ID " + req.params.statusUpdateId + " found :(");  
    }
})

router.post('/', async function(req, res) {
    const newStatusUpdate = {};

    if(!req.body.content) {
        res.status(400);
        return res.send('Some values for new statusUpdatee missing: ' + JSON.stringify(req.body));
    }

    newStatusUpdate.content = req.body.content;

    const owner = jwtHelpers.decrypt(req.cookies.statusUpdateToken);
    newStatusUpdate.username = owner;

    const statusUpdateDBResponse = await statusUpdateModel.insertStatusUpdate(newStatusUpdate);

    res.send(statusUpdateDBResponse);
})


module.exports = router;
