const mongoose = require("mongoose")

const StatusUpdateSchema = require('./statusUpdate.schema').StatusUpdateSchema

const StatusUpdateModel = mongoose.model("StatusUpdate", StatusUpdateSchema);

function insertStatusUpdate(statusUpdate) {
    return StatusUpdateModel.create(statusUpdate);
}

function getAllStatusUpdate() {
    return StatusUpdateModel.find().exec();
}

function findStatusUpdateByUser(user) {
    return StatusUpdateModel.find({user: user}).exec();
}

function findStatusUpdateById(id) {
    return StatusUpdateModel.findById(id).exec();
}

module.exports = {
    findStatusUpdateByUser,
    insertStatusUpdate,
    getAllStatusUpdate,
    findStatusUpdateById
};