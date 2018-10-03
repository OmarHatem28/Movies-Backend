const joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5
    }
}));

function validateCustomer(customer) {
    const schema = {
        name: joi.string().min(3).required(),
        isGold: joi.boolean(),
        phone: joi.string().min(3).required()
    };
    return joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;