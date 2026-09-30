const express = require('express');
const router = express.Router();
const {
  getStudyPlan,
  generateStudyPlan,
  adjustStudyHours,
  chatAiPlan,
  applyAiChanges,
  createTask,
  updateTask,
  deleteTask,
  searchTopics,
  addTopicToPlan,
  getResources
} = require('../controllers/studyPlanController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Plan Generation & Overview
router.get('/', getStudyPlan);
router.post('/generate', generateStudyPlan);
router.put('/adjust-hours', adjustStudyHours);

// AI Planning Interactions
router.post('/ai/chat', chatAiPlan);
router.post('/ai/apply-changes', applyAiChanges);

// Tasks CRUD
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// Curated Topics & Resource Exploration
router.get('/topics/search', searchTopics);
router.post('/topics/add-to-plan', addTopicToPlan);
router.get('/resources', getResources);

module.exports = router;
