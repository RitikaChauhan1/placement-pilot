/**
 * Utility to calculate profile completion dynamically
 * Checks 11 key professional developer profile sections
 */
export function calculateProfileCompletion(profileData = {}) {
  const checks = [
    {
      id: 'basic_info',
      label: 'Basic Information',
      tab: 'About',
      isFilled: Boolean(profileData.name && profileData.degree && profileData.college),
    },
    {
      id: 'about',
      label: 'About & Bio',
      tab: 'About',
      isFilled: Boolean(profileData.bio && profileData.bio.trim().length > 15),
    },
    {
      id: 'education',
      label: 'Education',
      tab: 'Education',
      isFilled: Boolean(Array.isArray(profileData.education) && profileData.education.length > 0),
    },
    {
      id: 'skills',
      label: 'Skills',
      tab: 'Skills',
      isFilled: Boolean(
        (Array.isArray(profileData.skills_list) && profileData.skills_list.length > 0) ||
        (Array.isArray(profileData.skills) && profileData.skills.length > 0) ||
        (profileData.skills && typeof profileData.skills === 'string' && profileData.skills.trim().length > 0)
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      tab: 'Projects',
      isFilled: Boolean(Array.isArray(profileData.projects) && profileData.projects.length > 0),
    },
    {
      id: 'experience',
      label: 'Work Experience',
      tab: 'Experience',
      isFilled: Boolean(Array.isArray(profileData.experience) && profileData.experience.length > 0),
    },
    {
      id: 'achievements',
      label: 'Achievements',
      tab: 'Achievements',
      isFilled: Boolean(Array.isArray(profileData.achievements) && profileData.achievements.length > 0),
    },
    {
      id: 'certifications',
      label: 'Certifications',
      tab: 'Certifications',
      isFilled: Boolean(Array.isArray(profileData.certifications) && profileData.certifications.length > 0),
    },
    {
      id: 'coding_profiles',
      label: 'Coding Profiles',
      tab: 'Coding Profiles',
      isFilled: Boolean(
        (Array.isArray(profileData.coding_profiles) && profileData.coding_profiles.length > 0) ||
        (profileData.coding_profiles && typeof profileData.coding_profiles === 'object' && Object.keys(profileData.coding_profiles).length > 0)
      ),
    },
    {
      id: 'resume',
      label: 'Resume Uploaded',
      tab: 'About',
      isFilled: Boolean(profileData.resume?.url || profileData.resume_url || profileData.resume?.name),
    },
    {
      id: 'placement_target',
      label: 'Placement Target',
      tab: 'About',
      isFilled: Boolean(
        profileData.target_role ||
        profileData.placement_target?.role ||
        (profileData.target_companies && profileData.target_companies.length > 0)
      ),
    },
  ];

  const totalCount = checks.length;
  const completedCount = checks.filter((item) => item.isFilled).length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const nextIncomplete = checks.find((item) => !item.isFilled);

  return {
    percentage,
    completedCount,
    totalCount,
    items: checks,
    nextIncomplete,
  };
}
