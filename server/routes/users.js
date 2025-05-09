const express = require('express');
const router  = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/:id/movies', userController.getUserMovies);
router.post('/:id/movies', userController.addMovieToUser);
router.post('/:userId/lists', userController.createMovieList);
router.get('/:userId/lists', userController.getMovieLists);
router.post('/:userId/lists/:listId/movies', userController.addMovieToList);
router.delete('/:userId/lists/:listId/movies/:movieId', userController.removeMovieFromList);
router.delete('/:userId/lists/:listId', userController.deleteMovieList);
router.post('/register', userController.registerUser);
router.get('/:userId/lists/:listId', userController.getMoviesForList);

module.exports = router;
