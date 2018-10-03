const express = require('express');
const genres = require('./routes/genres');
const home = require('./routes/home');
const mongoose = require('mongoose');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

if ( !config.get('jwtPrivateKey') ){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));


const app = express();
app.use(express.json());

app.use('/genres', genres);
app.use('/', home);
app.use('/customers',customers);
app.use('/movies',movies);
app.use('/rentals',rentals);
app.use('/users',users);
app.use('/auth',auth);


app.listen('3000',() => {
    console.log('listening on port 3000...');
})


