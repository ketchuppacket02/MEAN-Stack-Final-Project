const express = require('express');
const router  = express.Router();
const movieController = require('../controllers/movieController');

router.get('/search', movieController.searchOmdb);
router.post('/', movieController.createMovie);
router.get('/', movieController.getAllMovies);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
