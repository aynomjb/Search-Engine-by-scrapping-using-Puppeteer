
const express = require('express')
const router = express.Router()

// IMPORT CONTROLLERS
const HomeController = require('../controllers/HomeController')

// ALL API ROUTES
router.post('/searchInTrustPilot', HomeController.searchInTrustPilot)
router.post('/searchInTrustedShops', HomeController.searchInTrustedShops)

module.exports = router
