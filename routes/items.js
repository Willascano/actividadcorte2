const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    Item.find()
        .then(items => res.json(items))
        .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', auth, (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        description: req.body.description
    });

    newItem.save()
        .then(item => {
            req.io.emit('newItem', item);
            res.status(201).json(item);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
