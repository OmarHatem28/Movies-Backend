const joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        default: false,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    }
});

userSchema.methods.generateAuthToken = function generateAuthToken() {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: joi.string().min(3).required(),
        email: joi.string().min(5).required(),
        password: joi.string().min(3).required()
    };
    return joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;