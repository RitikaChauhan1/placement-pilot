const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  toggleTask,
  addTask
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/summary', getDashboardData);
router.patch('/tasks/:id/toggle', toggleTask);
router.post('/tasks', addTask);

module.exports = router;
