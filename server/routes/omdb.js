const express = require('express');
const router  = express.Router();
const omdbController = require('../controllers/omdbController');

router.get('/search', omdbController.searchOmdb);

module.exports = router;
