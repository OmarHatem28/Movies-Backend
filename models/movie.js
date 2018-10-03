const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');


const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre: {
        type: genreSchema,
        required: true
    }
}));

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(3).required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
        genreId: Joi.objectId().required()
    };
    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;