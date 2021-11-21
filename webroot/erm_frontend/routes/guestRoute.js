const express = require('express');
const router = express.Router();

const guestController = require('../controllers/guestController');

router.get('/', guestController.showGuestList);
router.get('/add', guestController.showAddGuestForm);
router.get('/edit/:guestId', guestController.showEditGuestForm);
router.get('/details/:guestId', guestController.showGuestDetails);

module.exports = router;
