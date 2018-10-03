const express = require('express');
const router = express.Router();
const { Customer, validate} = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort({name: 1});
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if ( !customer ){
            return res.status(404).send("No customer with the given ID");
        }
        res.send(customer);
    }
    catch(err){
        return res.status(400).send(err.message);
    }
});

router.put('/:id', async ( req, res) => {
    const {error} = validate(req.body);
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }
    try{
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, { new: true } );

        if ( !customer ){
            return res.status(404).send('Invalid Customer ID');
        }

        return res.send(customer);
    }
    catch(err){
        return res.status(400).send(err.message);
    }
});

router.delete('/:id', async ( req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if ( !customer ){
            return res.status(404).send('Invalid Customer ID');
        }
        return res.send(customer);
    }
    catch(err){
        return res.status(400).send(err.message);
    }
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if ( error ){
        return res.status(400).send(error.details[0].message);
    }
    const newCustomer = Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })
    await newCustomer.save();
    return res.send(newCustomer);
});

module.exports = router;