import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/api';
import { DEFAULT_DEVELOPER_PROFILE } from '../data/mockProfileData';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileNavigation from '../components/profile/ProfileNavigation';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileSummary from '../components/profile/ProfileSummary';
import ProfileSection from '../components/profile/ProfileSection';
import EditProfileModal from '../components/profile/EditProfileModal';
import PublicProfileModal from '../components/profile/PublicProfileModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile: authProfile, updateLocalProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('About');
  const [profileData, setProfileData] = useState(DEFAULT_DEVELOPER_PROFILE);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch latest profile from API and merge with developer profile baseline
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileApi.getProfile();
        if (res.success && res.profile) {
          const p = res.profile;

          // Merge backend database values with developer profile structure
          setProfileData((prev) => {
            const parsedSkills = p.skills
              ? p.skills.split(',').map((s) => s.trim()).filter(Boolean)
              : prev.skills;

            const parsedLanguages = p.programming_languages
              ? p.programming_languages.split(',').map((l) => l.trim()).filter(Boolean)
              : prev.programming_languages;

            return {
              ...prev,
              name: p.name || user?.name || prev.name,
              college: p.college || prev.college,
              degree: p.degree || prev.degree,
              graduation_year: p.graduation_year || prev.graduation_year,
              target_role: p.target_role || prev.target_role,
              target_company: p.target_companies || prev.target_company,
              readiness_percentage: p.readiness_percentage ?? prev.readiness_percentage,
              skills: parsedSkills,
              programming_languages: parsedLanguages,
            };
          });
        }
      } catch (err) {
        console.warn('Using default developer profile data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileUpdated = (updated) => {
    setProfileData(updated);
    if (updateLocalProfile) {
      updateLocalProfile({
        name: updated.name,
        college: updated.college,
        degree: updated.degree,
        graduation_year: updated.graduation_year,
        skills: Array.isArray(updated.skills) ? updated.skills.join(', ') : updated.skills,
        programming_languages: Array.isArray(updated.programming_languages)
          ? updated.programming_languages.join(', ')
          : updated.programming_languages,
        target_role: updated.target_role,
        target_companies: updated.target_company,
        readiness_percentage: updated.readiness_percentage,
      });
    }

    setNotification({
      type: 'success',
      message: 'Profile and placement goals successfully updated!',
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const counts = {
    Education: profileData.education?.length || 0,
    Skills: (profileData.skills?.length || 0) + (profileData.programming_languages?.length || 0),
    Achievements: profileData.achievements?.length || 0,
    Experience: profileData.experience?.length || 0,
    Projects: profileData.projects?.length || 0,
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
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
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 shadow-2xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* 1. Professional Profile Header (Full Width) */}
      <ProfileHeader
        profile={profileData}
        onEditProfile={() => setIsEditModalOpen(true)}
        onViewPublicProfile={() => setIsPublicModalOpen(true)}
        onEditAvatar={() => setIsEditModalOpen(true)}
      />

      {/* 2. Main Two-Column Layout on Desktop / Stacked on Tablet & Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Main Profile Content (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Professional Stats (DSA, Projects, Certifications, Achievements) */}
          <ProfileStats
            stats={profileData.stats}
            onStatClick={(tab) => setActiveTab(tab)}
          />

          {/* Horizontal Profile Navigation (Horizontally scrollable on small screens) */}
          <ProfileNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />

          {/* Active Tab Section Content */}
          <ProfileSection
            activeTab={activeTab}
            profile={profileData}
            onEditSection={() => setIsEditModalOpen(true)}
          />
        </div>

        {/* Right Column: Profile Summary Sidebar (4 cols on desktop) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          <ProfileSummary
            profile={profileData}
            onEditGoal={() => setIsEditModalOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profileData}
        onProfileUpdated={handleProfileUpdated}
      />

      <PublicProfileModal
        isOpen={isPublicModalOpen}
        onClose={() => setIsPublicModalOpen(false)}
        profile={profileData}
      />
    </div>
  );
}