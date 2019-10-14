
const express = require('express')
const router = express.Router()

// IMPORT CONTROLLERS
const HomeController = require('../controllers/HomeController')

// ALL VIEW ROUTES
router.get('/', HomeController.getView)


module.exports = router
