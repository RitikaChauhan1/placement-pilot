const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  addExperience,
  updateExperience,
  deleteExperience,
  addProject,
  updateProject,
  deleteProject,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addCertification,
  updateCertification,
  deleteCertification,
  addCodingProfile,
  updateCodingProfile,
  deleteCodingProfile,
  addSocial,
  updateSocial,
  deleteSocial,
  updateResume,
  deleteResume,
  getPlacementTarget,
  updatePlacementTarget
} = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Base Profile
router.get('/', getProfile);
router.put('/', updateProfile);
router.patch('/', updateProfile);

// Placement Target
router.get('/placement-target', getPlacementTarget);
router.patch('/placement-target', updatePlacementTarget);
router.post('/placement-target', updatePlacementTarget);
router.put('/placement-target', updatePlacementTarget);

// Education
router.post('/education', addEducation);
router.patch('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Skills
router.post('/skills', addSkill);
router.patch('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Experience
router.post('/experience', addExperience);
router.patch('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Projects
router.post('/projects', addProject);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Achievements
router.post('/achievements', addAchievement);
router.patch('/achievements/:id', updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Certifications
router.post('/certifications', addCertification);
router.patch('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

// Coding Profiles
router.post('/coding-profiles', addCodingProfile);
router.patch('/coding-profiles/:id', updateCodingProfile);
router.delete('/coding-profiles/:id', deleteCodingProfile);

// Socials
router.post('/socials', addSocial);
router.patch('/socials/:id', updateSocial);
router.delete('/socials/:id', deleteSocial);

// Resume
router.post('/resume', updateResume);
router.delete('/resume', deleteResume);

module.exports = router;
