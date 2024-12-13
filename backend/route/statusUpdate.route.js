const express = require('express');
const router = express.Router();
const statusUpdateModel = require('../db/statusUpdate.model');
const jwtHelpers = require('./helpers/jwt');

// Get all status updates
router.get('/', async function(req, res) {
    try {
        const statusUpdateList = await statusUpdateModel.getAllStatusUpdate();
        res.send(statusUpdateList);
    } catch (error) {
        res.status(500).send("Error fetching status updates: " + error.message);
    }
});

// Get status updates by user
router.get('/user/:username', async function(req, res) {
    const username = req.params.username;

    try {
        const statusUpdateList = await statusUpdateModel.findStatusUpdateByUsername(username);
        res.send(statusUpdateList);
    } catch (error) {
        res.status(500).send("Error fetching status updates for user: " + username);
    }
});

// Get status update by ID
router.get('/:statusUpdateId', async function(req, res) {
    const token = req.cookies.statusUpdateToken;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided.");
    }

    const owner = jwtHelpers.decrypt(token);
    if (!owner) {
        return res.status(401).send("Unauthorized: Invalid token.");
    }

    const statusUpdateId = req.params.statusUpdateId;

    try {
        const statusUpdate = await statusUpdateModel.findStatusUpdateById(statusUpdateId);
        if (!statusUpdate) {
            return res.status(404).send("No status update with ID " + statusUpdateId + " found.");
        }
        if (statusUpdate.username !== owner) {
            return res.status(403).send("Forbidden: You do not have access to this status update.");
        }
        res.send(statusUpdate);
    } catch (error) {
        res.status(500).send("Error fetching status update: " + error.message);
    }
});

// Create a new status update
router.post('/', async function(req, res) {
    if (!req.body.content) {
        return res.status(400).send('Content is required for a new status update');
    }

    const token = req.cookies.userToken;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided.");
    }

    const owner = jwtHelpers.decrypt(token);
    if (!owner) {
        return res.status(401).send("Unauthorized: Invalid token.");
    }

    const newStatusUpdate = {
        content: req.body.content,
        username: owner,
    };

    try {
        const statusUpdateDBResponse = await statusUpdateModel.insertStatusUpdate(newStatusUpdate);
        res.send(statusUpdateDBResponse);
    } catch (error) {
        res.status(500).send("Error inserting status update: " + error.message);
    }
});

// Update a status update by ID
router.put('/:statusUpdateId', async function (req, res) {
    const token = req.cookies.userToken;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided.");
    }

    const owner = jwtHelpers.decrypt(token);
    if (!owner) {
        return res.status(401).send("Unauthorized: Invalid token.");
    }

    const { statusUpdateId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).send("Content is required for updating the status update.");
    }

    try {
        const statusUpdate = await statusUpdateModel.findStatusUpdateById(statusUpdateId);
        if (!statusUpdate) {
            return res.status(404).send("Status update not found.");
        }
        if (statusUpdate.username !== owner) {
            return res.status(403).send("Forbidden: You do not have access to update this status update.");
        }

        const updatedStatusUpdate = await statusUpdateModel.updateStatusUpdateById(statusUpdateId, { content });
        res.send(updatedStatusUpdate);
    } catch (error) {
        res.status(500).send("Error updating status update: " + error.message);
    }
});

// Delete a status update by ID
router.delete('/:statusUpdateId', async function (req, res) {
    const token = req.cookies.userToken;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided.");
    }

    const owner = jwtHelpers.decrypt(token);
    if (!owner) {
        return res.status(401).send("Unauthorized: Invalid token.");
    }

    const { statusUpdateId } = req.params;

    try {
        const statusUpdate = await statusUpdateModel.findStatusUpdateById(statusUpdateId);
        if (!statusUpdate) {
            return res.status(404).send("Status update not found.");
        }
        if (statusUpdate.username !== owner) {
            return res.status(403).send("Forbidden: You do not have access to delete this post.");
        }

        await statusUpdateModel.deleteStatusUpdateById(statusUpdateId);
        res.send({ message: "Status update deleted successfully." });
    } catch (error) {
        res.status(500).send("Error deleting status update: " + error.message);
    }
});

module.exports = router;