const express = require('express');
const searchController = require('./searchController');
const albumOfTheDayController = require('./albumOfTheDayController');
const musicController = require('./musicController');
// const eventsController = require('./eventsController');
// const profileController = require('./profileController');
// const reviewsController = require('./reviewsController');
const router = express.Router();

//searchController
router.route('/search/:search').get(searchController.handleSearch);

// albumOfTheDayController
router.route('/album-of-the-day').post(albumOfTheDayController.setAlbumOfTheDay);

// musicController
router.route('/music/artist').post(musicController.saveArtist);
router.route('/music/album').post(musicController.saveAlbum);

module.exports = router;
