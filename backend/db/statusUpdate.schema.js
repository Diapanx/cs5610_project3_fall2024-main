const Schema = require('mongoose').Schema;

exports.StatusUpdateSchema = new Schema({
    // mongoose automically gives this an _id attribute of ObjectId
    username: String,
    content: { type: String, required: true, maxlength: 280 },
    created: { type: Date, default: Date.now() },
// this explicitly declares what collection we're using
}, { collection : 'statusUpdates' });