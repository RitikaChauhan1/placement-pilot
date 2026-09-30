import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/api';
import { DEFAULT_DEVELOPER_PROFILE } from '../data/mockProfileData';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileNavigation from '../components/profile/ProfileNavigation';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import ProfileSummary from '../components/profile/ProfileSummary';
import ProfileSection from '../components/profile/ProfileSection';
import PublicProfileModal from '../components/profile/PublicProfileModal';

// Modals
import EditBasicInfoModal from '../components/profile/modals/EditBasicInfoModal';
import EditAboutModal from '../components/profile/modals/EditAboutModal';
import EditEducationModal from '../components/profile/modals/EditEducationModal';
import EditSkillModal from '../components/profile/modals/EditSkillModal';
import EditExperienceModal from '../components/profile/modals/EditExperienceModal';
import EditProjectModal from '../components/profile/modals/EditProjectModal';
import EditAchievementModal from '../components/profile/modals/EditAchievementModal';
import EditCertificationModal from '../components/profile/modals/EditCertificationModal';
import EditCodingProfileModal from '../components/profile/modals/EditCodingProfileModal';
import EditSocialLinkModal from '../components/profile/modals/EditSocialLinkModal';
import UploadResumeModal from '../components/profile/modals/UploadResumeModal';
import EditPlacementTargetModal from '../components/profile/modals/EditPlacementTargetModal';
import DeleteConfirmModal from '../components/profile/modals/DeleteConfirmModal';

import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateLocalProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('About');
  const [profileData, setProfileData] = useState(DEFAULT_DEVELOPER_PROFILE);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal Visibility & Active Item States
  const [isBasicInfoModalOpen, setIsBasicInfoModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [isCodingProfileModalOpen, setIsCodingProfileModalOpen] = useState(false);
  const [selectedCodingProfile, setSelectedCodingProfile] = useState(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPlacementTargetModalOpen, setIsPlacementTargetModalOpen] = useState(false);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);

  // Delete Confirmation Modal State
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    title: '',
    itemName: '',
    message: '',
    onConfirm: null,
    loading: false
  });

  const showToast = (message, type = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Recalculate dynamic stats from current state
  const refreshStats = (current) => {
    const dsaSolved = (current.coding_profiles || []).reduce((sum, item) => {
      return sum + (Number(item.solved) || Number(item.solved_count) || 0);
    }, 0);

    return {
      dsa_problems: dsaSolved || current.stats?.dsa_problems || 220,
      projects: (current.projects || []).length,
      certifications: (current.certifications || []).length,
      achievements: (current.achievements || []).length
    };
  };

  // Fetch full profile from backend on mount
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getProfile();
      if (res.success && res.profile) {
        const p = res.profile;
        setProfileData({
          ...DEFAULT_DEVELOPER_PROFILE,
          ...p,
          stats: p.stats || refreshStats(p),
          education: p.education || DEFAULT_DEVELOPER_PROFILE.education,
          skills_list: p.skills_list || [],
          experience: p.experience || DEFAULT_DEVELOPER_PROFILE.experience,
          projects: p.projects || DEFAULT_DEVELOPER_PROFILE.projects,
          achievements: p.achievements || DEFAULT_DEVELOPER_PROFILE.achievements,
          certifications: p.certifications || DEFAULT_DEVELOPER_PROFILE.certifications,
          coding_profiles: p.coding_profiles || DEFAULT_DEVELOPER_PROFILE.coding_profiles,
          socials_list: p.socials_list || [],
          socials: p.socials || DEFAULT_DEVELOPER_PROFILE.socials,
          resume: p.resume || DEFAULT_DEVELOPER_PROFILE.resume,
          placement_target: p.placement_target || DEFAULT_DEVELOPER_PROFILE.placement_target
        });
      }
    } catch (err) {
      console.warn('Failed to load profile from backend, using baseline data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  // =========================================================================
  // SECTION SAVE & UPDATE HANDLERS (PERSIST TO BACKEND)
  // =========================================================================

  // 1. Basic Info
  const handleSaveBasicInfo = async (payload) => {
    const res = await profileApi.updateProfile(payload);
    if (res.success) {
      setProfileData(prev => {
        const updated = { ...prev, ...res.profile };
        return { ...updated, stats: refreshStats(updated) };
      });
      if (updateLocalProfile) updateLocalProfile(res.profile);
      showToast('✓ Basic information saved successfully');
    }
  };

  // 2. About
  const handleSaveAbout = async (payload) => {
    const res = await profileApi.updateProfile({ bio: payload.bio });
    if (res.success) {
      setProfileData(prev => ({ ...prev, bio: payload.bio }));
      showToast('✓ About section updated successfully');
    }
  };

  // 3. Education CRUD
  const handleSaveEducation = async (payload, id) => {
    let res;
    if (id) {
      res = await profileApi.updateEducation(id, payload);
    } else {
      res = await profileApi.addEducation(payload);
    }

    if (res.success && res.education) {
      setProfileData(prev => {
        const updatedList = id
          ? prev.education.map(e => (e.id === id ? res.education : e))
          : [res.education, ...prev.education];
        const next = { ...prev, education: updatedList };
        return { ...next, stats: refreshStats(next) };
      });
      showToast(id ? '✓ Education record updated' : '✓ Education record added');
    }
  };

  const handleDeleteEducation = (item) => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: item.institution,
      title: 'Delete Education Entry?',
      message: `Are you sure you want to remove ${item.degree} from ${item.institution}? This information will be removed from your profile.`,
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteEducation(item.id);
          setProfileData(prev => {
            const next = {
              ...prev,
              education: prev.education.filter(e => e.id !== item.id)
            };
            return { ...next, stats: refreshStats(next) };
          });
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Education entry deleted');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to delete education', 'error');
        }
      }
    });
  };

  // 4. Skills CRUD
  const handleSaveSkill = async (payload, id) => {
    let res;
    if (id) {
      res = await profileApi.updateSkill(id, payload);
    } else {
      res = await profileApi.addSkill(payload);
    }

    if (res.success && res.skill) {
      setProfileData(prev => {
        const currentList = prev.skills_list || [];
        const updatedList = id
          ? currentList.map(s => (s.id === id ? res.skill : s))
          : [...currentList, res.skill];
        const next = { ...prev, skills_list: updatedList };
        return { ...next, stats: refreshStats(next) };
      });
      showToast(id ? '✓ Skill updated' : '✓ New skill added');
    }
  };

  const handleDeleteSkill = (item) => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: item.name,
      title: 'Remove Skill?',
      message: `Are you sure you want to remove "${item.name}" from your technical skills list?`,
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteSkill(item.id);
          setProfileData(prev => {
            const next = {
              ...prev,
              skills_list: (prev.skills_list || []).filter(s => s.id !== item.id)
            };
            return { ...next, stats: refreshStats(next) };
          });
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Skill removed');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to delete skill', 'error');
        }
      }
    });
  };

  // 5. Work Experience CRUD
  const handleSaveExperience = async (payload, id) => {
    let res;
    if (id) {
      res = await profileApi.updateExperience(id, payload);
    } else {
      res = await profileApi.addExperience(payload);
    }

    if (res.success && res.experience) {
      setProfileData(prev => {
        const currentList = prev.experience || [];
        const updatedList = id
          ? currentList.map(e => (e.id === id ? res.experience : e))
          : [res.experience, ...currentList];
        const next = { ...prev, experience: updatedList };
        return { ...next, stats: refreshStats(next) };
      });
      showToast(id ? '✓ Experience updated' : '✓ Work experience added');
    }
  };

  const handleDeleteExperience = (item) => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: `${item.role} at ${item.company}`,
      title: 'Delete Experience Entry?',
      message: `Are you sure you want to remove your experience at ${item.company}?`,
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteExperience(item.id);
          setProfileData(prev => {
            const next = {
              ...prev,
              experience: (prev.experience || []).filter(e => e.id !== item.id)
            };
            return { ...next, stats: refreshStats(next) };
          });
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Experience deleted');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to delete experience', 'error');
        }
      }
    });
  };

  // 6. Projects CRUD
  const handleSaveProject = async (payload, id) => {
    let res;
    if (id) {
      res = await profileApi.updateProject(id, payload);
    } else {
      res = await profileApi.addProject(payload);
    }

    if (res.success && res.project) {
      setProfileData(prev => {
        const currentList = prev.projects || [];
        const updatedList = id
          ? currentList.map(p => (p.id === id ? res.project : p))
          : [res.project, ...currentList];
        const next = { ...prev, projects: updatedList };
        return { ...next, stats: refreshStats(next) };
      });
      showToast(id ? '✓ Project updated' : '✓ Project created successfully');
    }
  };

  const handleDeleteProject = (item) => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: item.title || item.name,
      title: 'Delete Project?',
      message: `Are you sure you want to remove "${item.title || item.name}"? This project will be removed from your portfolio.`,
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteProject(item.id);
          setProfileData(prev => {
            const next = {
              ...prev,
              projects: (prev.projects || []).filter(p => p.id !== item.id)
            };
            return { ...next, stats: refreshStats(next) };
          });
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Project deleted');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to delete project', 'error');
        }
      }
    });
  };

  // 7. Achievements CRUD
  const handleSaveAchievement = async (payload, id) => {
    let res;
    if (id) {
      res = await profileApi.updateAchievement(id, payload);
    } else {
      res = await profileApi.addAchievement(payload);
    }

    if (res.success && res.achievement) {
      setProfileData(prev => {
        const currentList = prev.achievements || [];
        const updatedList = id
          ? currentList.map(a => (a.id === id ? res.achievement : a))
          : [res.achievement, ...currentList];
        const next = { ...prev, achievements: updatedList };
        return { ...next, stats: refreshStats(next) };
      });
      showToast(id ? '✓ Achievement updated' : '✓ Achievement added');
    }
  };

  const handleDeleteAchievement = (item) => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: item.title,
      title: 'Delete Achievement?',
      message: `Are you sure you want to remove "${item.title}"?`,
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteAchievement(item.id);
          setProfileData(prev => {
            const next = {
              ...prev,
              achievements: (prev.achievements || []).filter(a => a.id !== item.id)
            };
            return { ...next, stats: refreshStats(next) };
          });
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Achievement removed');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to delete achievement', 'error');
        }
      }
    });
  };

  // 8. Certifications CRUD
  const handleSaveCertification = async (payload, id) => {
    let res;
    if (id) {
      res = await profileApi.updateCertification(id, payload);
    } else {
      res = await profileApi.addCertification(payload);
    }

    if (res.success && res.certification) {
      setProfileData(prev => {
        const currentList = prev.certifications || [];
        const updatedList = id
          ? currentList.map(c => (c.id === id ? res.certification : c))
          : [res.certification, ...currentList];
        const next = { ...prev, certifications: updatedList };
        return { ...next, stats: refreshStats(next) };
      });
      showToast(id ? '✓ Certification updated' : '✓ Certification added');
    }
  };

  const handleDeleteCertification = (item) => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: item.name || item.title,
      title: 'Delete Certification?',
      message: `Are you sure you want to remove "${item.name || item.title}"? This credential will be removed from your profile.`,
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteCertification(item.id);
          setProfileData(prev => {
            const next = {
              ...prev,
              certifications: (prev.certifications || []).filter(c => c.id !== item.id)
            };
            return { ...next, stats: refreshStats(next) };
          });
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Certification deleted');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to delete certification', 'error');
        }
      }
    });
  };

  // 9. Coding Profiles CRUD
  const handleSaveCodingProfile = async (payload, id) => {
    let res;
    if (id) {
      res = await profileApi.updateCodingProfile(id, payload);
    } else {
      res = await profileApi.addCodingProfile(payload);
    }

    if (res.success && res.coding_profile) {
      setProfileData(prev => {
        const currentList = prev.coding_profiles || [];
        const updatedList = id
          ? currentList.map(cp => (cp.id === id ? res.coding_profile : cp))
          : [...currentList, res.coding_profile];
        const next = { ...prev, coding_profiles: updatedList };
        return { ...next, stats: refreshStats(next) };
      });
      showToast(id ? '✓ Coding profile updated' : '✓ Coding platform connected');
    }
  };

  const handleDeleteCodingProfile = (item) => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: item.platform,
      title: 'Disconnect Platform?',
      message: `Are you sure you want to remove your ${item.platform} coding profile?`,
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteCodingProfile(item.id);
          setProfileData(prev => {
            const next = {
              ...prev,
              coding_profiles: (prev.coding_profiles || []).filter(cp => cp.id !== item.id)
            };
            return { ...next, stats: refreshStats(next) };
          });
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Platform disconnected');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to delete platform', 'error');
        }
      }
    });
  };

  // 10. Socials CRUD
  const handleSaveSocial = async (payload, id) => {
    let res;
    if (id) {
      res = await profileApi.updateSocial(id, payload);
    } else {
      res = await profileApi.addSocial(payload);
    }

    if (res.success && res.social) {
      setProfileData(prev => {
        const currentList = prev.socials_list || [];
        const updatedList = id
          ? currentList.map(s => (s.id === id ? res.social : s))
          : [...currentList, res.social];
        return { ...prev, socials_list: updatedList };
      });
      showToast(id ? '✓ Social link updated' : '✓ Social handle added');
    }
  };

  const handleDeleteSocial = (item) => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: item.label || item.platform,
      title: 'Delete Social Link?',
      message: `Are you sure you want to remove the link to ${item.label || item.platform}?`,
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteSocial(item.id);
          setProfileData(prev => ({
            ...prev,
            socials_list: (prev.socials_list || []).filter(s => s.id !== item.id)
          }));
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Social link removed');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to remove link', 'error');
        }
      }
    });
  };

  // 11. Resume Upload & Delete
  const handleSaveResume = async (resumePayload) => {
    const res = await profileApi.updateResume(resumePayload);
    if (res.success && res.resume) {
      setProfileData(prev => ({ ...prev, resume: res.resume }));
      showToast('✓ Placement resume uploaded and saved');
    }
  };

  const handleDeleteResume = () => {
    setDeleteConfirmState({
      isOpen: true,
      itemName: profileData.resume?.name || 'Resume',
      title: 'Delete Uploaded Resume?',
      message: 'Are you sure you want to remove your resume? You will need to upload a new PDF for AI mock interviews and applications.',
      loading: false,
      onConfirm: async () => {
        try {
          setDeleteConfirmState(s => ({ ...s, loading: true }));
          await profileApi.deleteResume();
          setProfileData(prev => ({ ...prev, resume: null }));
          setDeleteConfirmState(s => ({ ...s, isOpen: false, loading: false }));
          showToast('✓ Resume deleted successfully');
        } catch (err) {
          setDeleteConfirmState(s => ({ ...s, loading: false }));
          showToast(err.message || 'Unable to delete resume', 'error');
        }
      }
    });
  };

  // 12. Placement Target Update & Study Plan Sync
  const handleSavePlacementTarget = async (targetPayload) => {
    const res = await profileApi.updatePlacementTarget(targetPayload);
    if (res.success) {
      setProfileData(prev => ({
        ...prev,
        target_role: targetPayload.role,
        target_company: (targetPayload.target_companies || [])[0] || prev.target_company,
        target_companies: targetPayload.target_companies,
        readiness_percentage: targetPayload.readiness,
        placement_target: {
          ...prev.placement_target,
          ...targetPayload
        }
      }));

      if (updateLocalProfile) {
        updateLocalProfile({
          target_role: targetPayload.role,
          target_companies: targetPayload.target_companies?.join(', '),
          readiness_percentage: targetPayload.readiness
        });
      }

      showToast('✓ Placement target updated & synchronized with Study Plan');
    }
  };

  // Dynamic counts for navigation tabs
  const counts = {
    Education: (profileData.education || []).length,
    Skills: (profileData.skills_list || profileData.skills || []).length,
    Achievements: (profileData.achievements || []).length,
    Certifications: (profileData.certifications || []).length,
    Experience: (profileData.experience || []).length,
    Projects: (profileData.projects || []).length,
    'Coding Profiles': (profileData.coding_profiles || []).length,
    Socials: (profileData.socials_list || []).length
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Loading professional developer profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeIn max-w-6xl pb-10">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-3 rounded-lg border flex items-center gap-2.5 text-xs shadow-2xs animate-fadeIn ${
          notification.type === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
        }`}>
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* 1. Professional Profile Header (Full Width) */}
      <ProfileHeader
        profile={profileData}
        onEditProfile={() => setIsBasicInfoModalOpen(true)}
        onViewPublicProfile={() => setIsPublicModalOpen(true)}
        onEditAvatar={() => setIsBasicInfoModalOpen(true)}
      />

      {/* 2. Main Two-Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Main Profile Content (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Dynamic Profile Completion Gauge (Section 15) */}
          <ProfileCompletion
            profile={profileData}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onCompleteClick={(item) => {
              if (item?.tab) setActiveTab(item.tab);
              if (item?.id === 'basic_info') setIsBasicInfoModalOpen(true);
              else if (item?.id === 'about') setIsAboutModalOpen(true);
              else if (item?.id === 'education') { setSelectedEducation(null); setIsEducationModalOpen(true); }
              else if (item?.id === 'skills') { setSelectedSkill(null); setIsSkillModalOpen(true); }
              else if (item?.id === 'projects') { setSelectedProject(null); setIsProjectModalOpen(true); }
              else if (item?.id === 'experience') { setSelectedExperience(null); setIsExperienceModalOpen(true); }
              else if (item?.id === 'achievements') { setSelectedAchievement(null); setIsAchievementModalOpen(true); }
              else if (item?.id === 'certifications') { setSelectedCertification(null); setIsCertificationModalOpen(true); }
              else if (item?.id === 'coding_profiles') { setSelectedCodingProfile(null); setIsCodingProfileModalOpen(true); }
              else if (item?.id === 'resume') setIsResumeModalOpen(true);
              else if (item?.id === 'placement_target') setIsPlacementTargetModalOpen(true);
            }}
          />

          {/* Professional Stats (DSA, Projects, Certifications, Achievements) (Section 16) */}
          <ProfileStats
            stats={profileData.stats}
            onStatClick={(tab) => setActiveTab(tab)}
          />

          {/* Horizontal Profile Navigation Tabs */}
          <ProfileNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />

          {/* Active Tab Section Content */}
          <ProfileSection
            activeTab={activeTab}
            profile={profileData}
            onEditAbout={() => setIsAboutModalOpen(true)}
            // Education
            onAddEducation={() => { setSelectedEducation(null); setIsEducationModalOpen(true); }}
            onEditEducation={(item) => { setSelectedEducation(item); setIsEducationModalOpen(true); }}
            onDeleteEducation={handleDeleteEducation}
            // Skills
            onAddSkill={() => { setSelectedSkill(null); setIsSkillModalOpen(true); }}
            onEditSkill={(item) => { setSelectedSkill(item); setIsSkillModalOpen(true); }}
            onDeleteSkill={handleDeleteSkill}
            // Experience
            onAddExperience={() => { setSelectedExperience(null); setIsExperienceModalOpen(true); }}
            onEditExperience={(item) => { setSelectedExperience(item); setIsExperienceModalOpen(true); }}
            onDeleteExperience={handleDeleteExperience}
            // Projects
            onAddProject={() => { setSelectedProject(null); setIsProjectModalOpen(true); }}
            onEditProject={(item) => { setSelectedProject(item); setIsProjectModalOpen(true); }}
            onDeleteProject={handleDeleteProject}
            // Achievements
            onAddAchievement={() => { setSelectedAchievement(null); setIsAchievementModalOpen(true); }}
            onEditAchievement={(item) => { setSelectedAchievement(item); setIsAchievementModalOpen(true); }}
            onDeleteAchievement={handleDeleteAchievement}
            // Certifications
            onAddCertification={() => { setSelectedCertification(null); setIsCertificationModalOpen(true); }}
            onEditCertification={(item) => { setSelectedCertification(item); setIsCertificationModalOpen(true); }}
            onDeleteCertification={handleDeleteCertification}
            // Coding Profiles
            onAddCodingProfile={() => { setSelectedCodingProfile(null); setIsCodingProfileModalOpen(true); }}
            onEditCodingProfile={(item) => { setSelectedCodingProfile(item); setIsCodingProfileModalOpen(true); }}
            onDeleteCodingProfile={handleDeleteCodingProfile}
            // Socials
            onAddSocial={() => { setSelectedSocial(null); setIsSocialModalOpen(true); }}
            onEditSocial={(item) => { setSelectedSocial(item); setIsSocialModalOpen(true); }}
            onDeleteSocial={handleDeleteSocial}
          />
        </div>

        {/* Right Column: Profile Summary Sidebar (4 cols on desktop) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          <ProfileSummary
            profile={profileData}
            onEditGoal={() => setIsPlacementTargetModalOpen(true)}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
            onDeleteResume={handleDeleteResume}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL DIALOGS (INDIVIDUAL SECTION EDITORS)                                  */}
      {/* ========================================================================= */}

      {/* 1. Basic Info Modal */}
      <EditBasicInfoModal
        isOpen={isBasicInfoModalOpen}
        onClose={() => setIsBasicInfoModalOpen(false)}
        profile={profileData}
        onSave={handleSaveBasicInfo}
      />

      {/* 2. About Modal */}
      <EditAboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        bio={profileData.bio}
        onSave={handleSaveAbout}
      />

      {/* 3. Education Modal */}
      <EditEducationModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        educationItem={selectedEducation}
        onSave={handleSaveEducation}
      />

      {/* 4. Skill Modal */}
      <EditSkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        skillItem={selectedSkill}
        onSave={handleSaveSkill}
      />

      {/* 5. Experience Modal */}
      <EditExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        experienceItem={selectedExperience}
        onSave={handleSaveExperience}
      />

      {/* 6. Project Modal */}
      <EditProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectItem={selectedProject}
        onSave={handleSaveProject}
      />

      {/* 7. Achievement Modal */}
      <EditAchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        achievementItem={selectedAchievement}
        onSave={handleSaveAchievement}
      />

      {/* 8. Certification Modal */}
      <EditCertificationModal
        isOpen={isCertificationModalOpen}
        onClose={() => setIsCertificationModalOpen(false)}
        certItem={selectedCertification}
        onSave={handleSaveCertification}
      />

      {/* 9. Coding Profile Modal */}
      <EditCodingProfileModal
        isOpen={isCodingProfileModalOpen}
        onClose={() => setIsCodingProfileModalOpen(false)}
        profileItem={selectedCodingProfile}
        onSave={handleSaveCodingProfile}
      />

      {/* 10. Social Link Modal */}
      <EditSocialLinkModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        socialItem={selectedSocial}
        onSave={handleSaveSocial}
      />

      {/* 11. Resume Upload Modal */}
      <UploadResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        currentResume={profileData.resume}
        onSaveResume={handleSaveResume}
        onDeleteResume={handleDeleteResume}
      />

      {/* 12. Placement Target Modal */}
      <EditPlacementTargetModal
        isOpen={isPlacementTargetModalOpen}
        onClose={() => setIsPlacementTargetModalOpen(false)}
        targetData={{
          role: profileData.target_role || profileData.placement_target?.role,
          target_companies: profileData.target_companies || (profileData.target_company ? [profileData.target_company] : []),
          readiness: profileData.readiness_percentage || profileData.placement_target?.readiness,
          target_date: profileData.placement_target?.target_date,
          target_salary: profileData.placement_target?.target_salary,
          job_type: profileData.placement_target?.job_type,
          preferred_technologies: profileData.placement_target?.preferred_technologies
        }}
        onSave={handleSavePlacementTarget}
      />

      {/* 13. Public Profile Preview Modal */}
      <PublicProfileModal
        isOpen={isPublicModalOpen}
        onClose={() => setIsPublicModalOpen(false)}
        profile={profileData}
      />

      {/* 14. Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmState.isOpen}
        title={deleteConfirmState.title}
        itemName={deleteConfirmState.itemName}
        message={deleteConfirmState.message}
        loading={deleteConfirmState.loading}
        onClose={() => setDeleteConfirmState(s => ({ ...s, isOpen: false }))}
        onConfirm={deleteConfirmState.onConfirm}
      />
    </div>
  );
}