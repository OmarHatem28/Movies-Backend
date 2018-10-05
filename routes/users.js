const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

//===================================================================================================
router.get('/me', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
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
router.put('/:id', auth, async (req,res) => {
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
router.delete('/:id', auth, async (req,res) => {
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
router.post('/', auth, async (req,res) => {
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

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});
//===================================================================================================
module.exports = router;