const express = require('express');
const router = express.Router();
const searchController = require('../controller/searchController');



router.get('/:id', searchController.getProfile)


module.exports = router;