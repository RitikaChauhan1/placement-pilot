/**
 * Utility to calculate profile completion dynamically
 * Checks 10 key professional developer profile components
 */
export function calculateProfileCompletion(profileData = {}) {
  const checks = [
    {
      id: 'basic_info',
      label: 'Basic Information',
      tab: 'About',
      isFilled: Boolean(profileData.name && profileData.name.trim()),
    },
    {
      id: 'about',
      label: 'About & Bio',
      tab: 'About',
      isFilled: Boolean(profileData.bio && profileData.bio.trim().length > 15),
    },
    {
      id: 'education',
      label: 'Education Details',
      tab: 'Education',
      isFilled: Boolean(profileData.college && profileData.degree),
    },
    {
      id: 'skills',
      label: 'Technical Skills',
      tab: 'Skills',
      isFilled: Boolean(
        (profileData.skills && profileData.skills.length > 0) ||
        (profileData.programming_languages && profileData.programming_languages.length > 0)
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      tab: 'Projects',
      isFilled: Boolean(
        (Array.isArray(profileData.projects) && profileData.projects.length > 0) ||
        (profileData.stats?.projects && Number(profileData.stats.projects) > 0)
      ),
    },
    {
      id: 'achievements',
      label: 'Achievements',
      tab: 'Achievements',
      isFilled: Boolean(
        (Array.isArray(profileData.achievements) && profileData.achievements.length > 0) ||
        (profileData.stats?.achievements && Number(profileData.stats.achievements) > 0)
      ),
    },
    {
      id: 'experience',
      label: 'Experience & Internships',
      tab: 'Experience',
      isFilled: Boolean(
        (Array.isArray(profileData.experience) && profileData.experience.length > 0) ||
        profileData.has_experience
      ),
    },
    {
      id: 'coding_profiles',
      label: 'Coding Profiles',
      tab: 'Coding Profiles',
      isFilled: Boolean(
        profileData.socials?.leetcode ||
        profileData.socials?.gfg ||
        profileData.socials?.codechef ||
        profileData.coding_profiles?.leetcode
      ),
    },
    {
      id: 'social_links',
      label: 'Social Links',
      tab: 'Socials',
      isFilled: Boolean(
        profileData.socials?.github ||
        profileData.socials?.linkedin
      ),
    },
    {
      id: 'resume',
      label: 'Resume Attached',
      tab: 'About',
      isFilled: Boolean(profileData.resume?.url || profileData.resume_url),
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
