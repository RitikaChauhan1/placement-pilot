import React from 'react';
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Camera,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import ProfileSocialLinks from './ProfileSocialLinks';

export default function ProfileHeader({
  profile = {},
  onEditProfile,
  onViewPublicProfile,
  onEditAvatar,
}) {
  const name = profile.name || 'Ritika Chauhan';
  const title = profile.headline || profile.title || 'Software Developer / Computer Science Student';
  const location = profile.location || 'India';
  const degree = profile.degree || 'B.Tech Computer Science';
  const college = profile.college || 'ABC University';
  const gradYear = profile.graduation_year || '2027';
  const avatarUrl = profile.avatar_url;

  // Initials for avatar fallback
  const getInitials = (str) => {
    if (!str) return 'RC';
    const parts = str.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Avatar + Identity + Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Avatar Container with Edit Action */}
          <div className="relative group flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-indigo-500/20 dark:border-indigo-500/30 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 flex items-center justify-center font-bold text-white text-xl sm:text-2xl shadow-sm tracking-wider">
                {getInitials(name)}
              </div>
            )}

            {/* Edit Avatar Trigger */}
            <button
              type="button"
              onClick={onEditAvatar || onEditProfile}
              title="Update profile picture"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 shadow-xs transition-all opacity-90 group-hover:opacity-100 hover:scale-105 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Identity & Metadata */}
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
                <ShieldCheck className="w-3 h-3 text-indigo-500" />
                Verified Student
              </span>
            </div>

            <p className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              {title}
            </p>

            {/* Compact Metadata Chips */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                {location}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 font-medium">
                <GraduationCap className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                {degree}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 font-medium">
                <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                {college} ({gradYear})
              </span>
            </div>

            {/* Social Links on Mobile/Tablet */}
            <div className="pt-1 md:hidden">
              <ProfileSocialLinks socials={profile.socials} size="sm" />
            </div>
          </div>
        </div>

        {/* Right: Actions & Social Links (Desktop) */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80">
          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onEditProfile}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={onViewPublicProfile}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-all focus:outline-none cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>View Public Profile</span>
            </button>
          </div>

          {/* Social Links on Desktop */}
          <div className="hidden md:flex items-center gap-2 pt-1">
            <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Profiles
            </span>
            <ProfileSocialLinks socials={profile.socials} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
