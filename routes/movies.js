const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');


//===================================================================================================
router.get('/', async (req,res) => {
    const movies = await Movie.find().sort({ title: 1 });
    res.send(movies);
});
//===================================================================================================
router.get('/:id', async (req,res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if ( !movie ){
            return res.status(404).send('Movie Not Found');
        }
        res.send(movie);
    }
    catch (err){
        return res.status(404).send('Movie Not Found');
    }
});
//===================================================================================================
router.put('/:id', async (req,res) => {
    const {error} = validate(req.body)
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            
        }, { new: true });
    
        if ( !movie ){
            return res.status(404).send('Movie Not Found');
        }
        
        res.send(movie)
    }
    catch(err){
        return res.status(404).send(err.message);
    }
});
//===================================================================================================
router.delete('/:id', async (req,res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if ( !movie ){
            return res.status(404).send('Movie Not Found');
        }
    
        res.send(movie);
    }
    catch(err){
        return res.status(404).send('Movie Not Found');
    }
});
//===================================================================================================
router.post('/', async (req,res) => {
    const {error} = validate(req.body)
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }

    try {
        const genre = await Genre.findById(req.body.genreId);
        if ( !genre ) return res.status(400).send('Invalid Genre');

        const movie = new Movie({
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            genre: {
                _id: genre.id,
                name: genre.name
            }
        });
        await movie.save();
        res.send(movie);
    }
    catch(err){
        return res.status(400).send(err.message);
    }
});
//===================================================================================================
module.exports = router;