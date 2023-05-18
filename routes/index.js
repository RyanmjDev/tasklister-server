const express = require('express');
const router = express.Router();

const taskRoutes = require('./task');
const userRoutes = require('./user');

router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);

module.exports = router;