const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: false
    },
    photo: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        required: true
    },
    premium: {
        type: Boolean,
        required: false
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;