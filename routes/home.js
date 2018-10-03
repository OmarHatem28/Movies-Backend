const express = require('express');
const router = express.Router();

const genres = [
    {id:1, name:'Horror'},
    {id:2, name:'Comedy'},
    {id:3, name:'Action'}
];

router.get('/',(req,res) => {
    res.status(200).send(genres);
});

module.exports = router;