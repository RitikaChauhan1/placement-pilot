const express = require('express');
const router = express.Router();
const {
  getStudyPlan,
  generateStudyPlan,
  adjustStudyHours
} = require('../controllers/studyPlanController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getStudyPlan);
router.post('/generate', generateStudyPlan);
router.put('/adjust-hours', adjustStudyHours);

module.exports = router;
