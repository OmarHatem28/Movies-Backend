const auth = require('../middleware/authorization');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');


//===================================================================================================
router.get('/', async (req,res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
});
//===================================================================================================
router.get('/:id', async (req,res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if ( !genre ){
            return res.status(404).send('Genre Not Found');
        }
        res.send(genre);
    }
    catch (err){
        return res.status(404).send('Genre Not Found');
    }
});
//===================================================================================================
router.put('/:id', auth, async (req,res) => {
    const {error} = validate(req.body)
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id,{
            name: req.body.name
        }, { new: true });
    
        if ( !genre ){
            return res.status(404).send('Genre Not Found');
        }
        
        res.send(genre)
    }
    catch(err){
        return res.status(404).send(err.message);
    }
});
//===================================================================================================
router.delete('/:id', auth, async (req,res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);

        if ( !genre ){
            return res.status(404).send('Genre Not Found');
        }
    
        res.send(genre);
    }
    catch(err){
        return res.status(404).send('Genre Not Found');
    }
});
//===================================================================================================
router.post('/', auth, async (req,res) => {
    const {error} = validate(req.body)
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }
    const newGenre = new Genre({
        name: req.body.name
    });
    await newGenre.save();
    res.send(newGenre);
});
//===================================================================================================
module.exports = router;