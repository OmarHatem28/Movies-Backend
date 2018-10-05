const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const joi = require('joi');


router.post('/', async (req,res) => {
    const {error} = validate(req.body)
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if ( !user ) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if ( !validPassword ) return res.status(400).send('Invalid email or password');

    try{
        const token = user.generateAuthToken();

        res.send(token);
    }
    catch(err){
        console.log(err.message);
    }
});
//===================================================================================================

function validate(req) {
    const schema = {
        email: joi.string().min(5).required(),
        password: joi.string().min(3).required()
    };
    return joi.validate(req, schema);
}

module.exports = router;

//===================================================================================================
// router.get('/', async (req,res) => {
//     const users = await User.find().sort({ name: 1 });
//     res.send(users);
// });
// //===================================================================================================
// router.get('/:id', async (req,res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if ( !user ){
//             return res.status(404).send('User Not Found');
//         }
//         res.send(user);
//     }
//     catch (err){
//         return res.status(400).send(err.message);
//     }
// });
// //===================================================================================================
// router.put('/:id', async (req,res) => {
//     const {error} = validate(req.body)
//     if ( error ){
//         return res.status(400).send(error.details[0].message);
//     }
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashed = await bcrypt.hash(req.body.password, salt);
//         const user = await User.findByIdAndUpdate(req.params.id,{
//             name: req.body.name,
//             email: req.body.email,
//             password: hashed
//         }, { new: true });
    
//         if ( !user ){
//             return res.status(404).send('User Not Found');
//         }
        
//         res.send(user)
//     }
//     catch(err){
//         return res.status(400).send(err.message);
//     }
// });
// //===================================================================================================
// router.delete('/:id', async (req,res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);

//         if ( !user ){
//             return res.status(404).send('User Not Found');
//         }
    
//         res.send(user);
//     }
//     catch(err){
//         return res.status(400).send(err.message);
//     }
// });
//===================================================================================================
