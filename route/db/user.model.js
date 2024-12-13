const mongoose = require("mongoose")

const UserSchema = require('./user.schema').UserSchema

const UserModel = mongoose.model("User", UserSchema);

function createUser(user) {
    return UserModel.create(user);
}


function findUserByUsername(username) {
    return UserModel.find({username: username}).exec();
}

function findOneAndUpdate(query, updateData, options) {
    return UserModel.findOneAndUpdate(query, updateData, options).exec();
}

module.exports = {
    createUser,
    findUserByUsername,
    findOneAndUpdate, // Export the new function
};