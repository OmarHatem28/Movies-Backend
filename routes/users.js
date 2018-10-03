const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

//===================================================================================================
router.get('/', async (req,res) => {
    const users = await User.find().sort({ name: 1 });
    res.send(users);
});
//===================================================================================================
router.get('/:id', async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if ( !user ){
            return res.status(404).send('User Not Found');
        }
        res.send(user);
    }
    catch (err){
        return res.status(400).send(err.message);
    }
});
//===================================================================================================
router.put('/:id', async (req,res) => {
    const {error} = validate(req.body)
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        const user = await User.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            email: req.body.email,
            password: hashed
        }, { new: true });
    
        if ( !user ){
            return res.status(404).send('User Not Found');
        }
        
        res.send(user)
    }
    catch(err){
        return res.status(400).send(err.message);
    }
});
//===================================================================================================
router.delete('/:id', async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if ( !user ){
            return res.status(404).send('User Not Found');
        }
    
        res.send(user);
    }
    catch(err){
        return res.status(400).send(err.message);
    }
});
//===================================================================================================
router.post('/', async (req,res) => {
    const {error} = validate(req.body)
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if ( user ) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();

    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});
//===================================================================================================
module.exports = router;