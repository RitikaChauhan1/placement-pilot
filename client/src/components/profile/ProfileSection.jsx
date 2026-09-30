import React, { useState, useMemo } from 'react';
import {
  User,
  GraduationCap,
  Code2,
  Trophy,
  Award,
  Briefcase,
  FolderGit2,
  Terminal,
  Share2,
  ExternalLink,
  Calendar,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Star,
  Plus,
  Edit2,
  Trash2,
  Search,
  Building2,
  FileCheck,
  Clock
} from 'lucide-react';
import { PlatformIcons } from './ProfileSocialLinks';

const SKILL_CATEGORIES = [
  'All',
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'Cloud',
  'AI/ML',
  'Tools',
  'Other'
];

export default function ProfileSection({
  activeTab,
  profile = {},
  onEditAbout,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
  onAddAchievement,
  onEditAchievement,
  onDeleteAchievement,
  onAddCertification,
  onEditCertification,
  onDeleteCertification,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAddCodingProfile,
  onEditCodingProfile,
  onDeleteCodingProfile,
  onAddSocial,
  onEditSocial,
  onDeleteSocial
}) {
  const [copiedLink, setCopiedLink] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(''), 2500);
  };

  // Top-level hooks for Skills normalization and filtering
  const rawSkills = profile.skills_list || [];
  const allSkills = useMemo(() => {
    if (Array.isArray(rawSkills) && rawSkills.length > 0 && typeof rawSkills[0] === 'object') {
      return rawSkills;
    }
    const list = [];
    if (profile.categorized_skills) {
      Object.entries(profile.categorized_skills).forEach(([cat, arr]) => {
        let categoryName = 'Other';
        if (cat === 'languages') categoryName = 'Programming Languages';
        else if (cat === 'frameworks') categoryName = 'Frontend';
        else if (cat === 'database_tools') categoryName = 'Database';
        else if (cat === 'fundamentals') categoryName = 'Other';

        (arr || []).forEach((item, idx) => {
          list.push({
            id: `${cat}-${idx}`,
            name: item,
            category: categoryName,
            proficiency: 'Advanced'
          });
        });
      });
    } else if (Array.isArray(profile.skills)) {
      profile.skills.forEach((sk, idx) => {
        list.push({
          id: `sk-${idx}`,
          name: sk,
          category: 'Frontend',
          proficiency: 'Advanced'
        });
      });
    }
    return list;
  }, [rawSkills, profile.categorized_skills, profile.skills]);

  const filteredSkills = useMemo(() => {
    return allSkills.filter(skill => {
      const matchesSearch = skill.name?.toLowerCase().includes(skillSearch.toLowerCase());
      const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [allSkills, skillSearch, selectedCategory]);

  // Top-level hooks for Socials normalization
  const rawSocials = profile.socials_list || profile.socials || [];
  const socialList = useMemo(() => {
    if (Array.isArray(rawSocials) && rawSocials.length > 0) {
      return rawSocials;
    }
    if (rawSocials && typeof rawSocials === 'object') {
      return Object.entries(rawSocials).map(([plat, url], idx) => ({
        id: `soc-${idx}`,
        platform: plat.charAt(0).toUpperCase() + plat.slice(1),
        url: url,
        label: plat.charAt(0).toUpperCase() + plat.slice(1)
      }));
    }
    return [];
  }, [rawSocials]);

  // ==========================================
  // SECTION 1: ABOUT
  // ==========================================
  if (activeTab === 'About') {
    return (
      <div className="space-y-4">
        {/* Bio Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <User className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold tracking-tight">Professional Summary</h2>
            </div>
            {onEditAbout && (
              <button
                type="button"
                onClick={onEditAbout}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="pt-3 space-y-3">
            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {profile.bio ||
                'Computer Science undergraduate passionate about building scalable web applications and algorithmic problem solving. Actively practicing Data Structures & Algorithms, System Design fundamentals, and modern web architectures. Seeking software engineering internships and full-time SDE roles.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                  Primary Domain
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {profile.headline || 'Full-Stack Engineering & Algorithms'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                  Interview Readiness
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Campus Placement Candidate ({profile.readiness_percentage ?? 75}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Career Objective & Targets */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Placement Preferences & Targets
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
              <span className="block text-[10.5px] text-slate-400 dark:text-slate-500 mb-0.5">
                Target Role
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {profile.target_role || profile.placement_target?.role || 'Software Development Engineer'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
              <span className="block text-[10.5px] text-slate-400 dark:text-slate-500 mb-0.5">
                Target Companies
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate block">
                {Array.isArray(profile.target_companies)
                  ? profile.target_companies.join(', ')
                  : profile.target_company || 'Accenture, Google'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
              <span className="block text-[10.5px] text-slate-400 dark:text-slate-500 mb-0.5">
                Graduation Batch
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Batch of {profile.graduation_year || '2026'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION 2: EDUCATION
  // ==========================================
  if (activeTab === 'Education') {
    const educationList = profile.education || [];

    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold tracking-tight">Academic Background</h2>
          </div>
          <button
            type="button"
            onClick={onAddEducation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        </div>

        <div className="space-y-4">
          {educationList.length > 0 ? (
            educationList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-2 group transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {item.institution}
                    </h3>
                    {item.location && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                      {item.grade || (item.cgpa ? `CGPA: ${item.cgpa}` : '')}
                    </span>

                    <button
                      type="button"
                      onClick={() => onEditEducation(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Edit education"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEducation(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete education"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span>{item.degree} {item.field_of_study ? `in ${item.field_of_study}` : ''}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.period || `${item.start_year || ''} - ${item.end_year || ''}`}
                  </span>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}

                {item.coursework && (
                  <div className="pt-1.5 flex flex-wrap gap-1">
                    {(Array.isArray(item.coursework) ? item.coursework : item.coursework.split(',')).map((course, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10.5px] rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {course.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-700/80 rounded-xl">
              <GraduationCap className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400">No education records found.</p>
              <button
                type="button"
                onClick={onAddEducation}
                className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
              >
                + Add your college / university degree
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION 3: SKILLS
  // ==========================================
  if (activeTab === 'Skills') {
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold tracking-tight">Technical Skills & Competencies</h2>
            <span className="text-[11px] text-slate-400 font-medium ml-1">
              ({allSkills.length})
            </span>
          </div>

          <button
            type="button"
            onClick={onAddSkill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search technical skills..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 profile-nav-scroll">
            {SKILL_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Chips Grid */}
        <div className="pt-2">
          {filteredSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filteredSkills.map(skill => (
                <div
                  key={skill.id || skill.name}
                  className="group inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 hover:border-indigo-500/60 transition-all text-xs text-slate-800 dark:text-slate-200"
                >
                  <span className="font-semibold">{skill.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                    {skill.proficiency || 'Intermediate'}
                  </span>

                  <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEditSkill(skill)}
                      className="p-1 hover:text-indigo-400 text-slate-400 transition-colors"
                      title="Edit skill"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSkill(skill)}
                      className="p-1 hover:text-rose-400 text-slate-400 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-700/80 rounded-xl">
              No skills match your search or filter.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION 4: ACHIEVEMENTS
  // ==========================================
  if (activeTab === 'Achievements') {
    const list = profile.achievements || [];
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold tracking-tight">Honors & Achievements</h2>
          </div>
          <button
            type="button"
            onClick={onAddAchievement}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200/80 dark:border-amber-800/60 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Achievement</span>
          </button>
        </div>

        <div className="space-y-3">
          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-2 group transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>{item.title}</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                      {item.date || item.year}
                    </span>
                    <button
                      type="button"
                      onClick={() => onEditAchievement(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Edit achievement"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAchievement(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete achievement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                  {item.organization || item.issuer}
                </p>

                {item.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {(item.url || item.certificate_url) && (
                  <div className="flex items-center gap-3 pt-1 text-xs">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Event Link</span>
                      </a>
                    )}
                    {item.certificate_url && (
                      <a
                        href={item.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
                      >
                        <Award className="w-3 h-3" />
                        <span>Certificate</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-700/80 rounded-xl">
              <Trophy className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400">No achievements recorded yet.</p>
              <button
                type="button"
                onClick={onAddAchievement}
                className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
              >
                + Add hackathon or contest achievement
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION 5: CERTIFICATIONS
  // ==========================================
  if (activeTab === 'Certifications') {
    const list = profile.certifications || [];
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Award className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold tracking-tight">Licenses & Certifications</h2>
          </div>
          <button
            type="button"
            onClick={onAddCertification}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-800/60 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="space-y-3">
          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-2 group transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {item.name || item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                      {item.issue_date || item.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => onEditCertification(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Edit certification"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCertification(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete certification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {item.issuer || item.organization}
                  </span>
                  {item.expiry_date && (
                    <>
                      <span>•</span>
                      <span>Expires: {item.expiry_date}</span>
                    </>
                  )}
                  {item.credential_id && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[11px]">ID: {item.credential_id}</span>
                    </>
                  )}
                </div>

                {(item.credential_url || item.url) && (
                  <div className="pt-1">
                    <a
                      href={item.credential_url || item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline font-medium"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-700/80 rounded-xl">
              <Award className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400">No certifications added yet.</p>
              <button
                type="button"
                onClick={onAddCertification}
                className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
              >
                + Add AWS, Meta, or Google credential
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION 6: EXPERIENCE
  // ==========================================
  if (activeTab === 'Experience') {
    const list = profile.experience || [];
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold tracking-tight">Experience & Internships</h2>
          </div>
          <button
            type="button"
            onClick={onAddExperience}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Experience</span>
          </button>
        </div>

        <div className="space-y-4">
          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-2 group transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {item.company}
                      </span>
                      {item.type && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {item.type}
                        </span>
                      )}
                      {item.location && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.period || `${item.start_date || ''} - ${item.end_date || 'Present'}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => onEditExperience(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Edit experience"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteExperience(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                )}

                {(item.skills || item.technologies) && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(Array.isArray(item.skills || item.technologies)
                      ? (item.skills || item.technologies)
                      : String(item.skills || item.technologies).split(',')
                    ).map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10.5px] rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {String(sk).trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-700/80 rounded-xl">
              <Briefcase className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400">No work experience or internships added yet.</p>
              <button
                type="button"
                onClick={onAddExperience}
                className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
              >
                + Add internship or project role
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION 7: PROJECTS
  // ==========================================
  if (activeTab === 'Projects') {
    const list = profile.projects || [];
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <FolderGit2 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold tracking-tight">Featured Developer Projects</h2>
          </div>
          <button
            type="button"
            onClick={onAddProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-2 hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {item.title || item.name}
                      </h3>
                      {item.featured && (
                        <span className="flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          Featured
                        </span>
                      )}
                      {item.role && (
                        <span className="text-[11px] text-slate-400">
                          • {item.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {(item.github || item.github_url) && (
                      <a
                        href={item.github || item.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-400 border border-slate-200/70 dark:border-slate-700 shadow-2xs transition-colors"
                        title="View GitHub Repository"
                      >
                        <PlatformIcons.github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {(item.live || item.live_url || item.demo) && (
                      <a
                        href={item.live || item.live_url || item.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-400 border border-slate-200/70 dark:border-slate-700 shadow-2xs transition-colors"
                        title="Live Deployment"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onEditProject(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {(item.tags || item.technologies) && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(Array.isArray(item.tags || item.technologies)
                      ? (item.tags || item.technologies)
                      : String(item.tags || item.technologies).split(',')
                    ).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10.5px] rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/60 font-medium"
                      >
                        {String(tag).trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-700/80 rounded-xl">
              <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400">No projects added yet.</p>
              <button
                type="button"
                onClick={onAddProject}
                className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
              >
                + Add your featured project
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION 8: CODING PROFILES
  // ==========================================
  if (activeTab === 'Coding Profiles') {
    const rawCp = profile.coding_profiles || [];
    const profilesList = Array.isArray(rawCp) ? rawCp : [];

    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold tracking-tight">Competitive Coding Handles</h2>
            </div>
            <button
              type="button"
              onClick={onAddCodingProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Platform</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {profilesList.length > 0 ? (
              profilesList.map((item) => {
                const platformKey = (item.platform || '').toLowerCase();
                const Icon = PlatformIcons[platformKey] || PlatformIcons.leetcode;

                return (
                  <div
                    key={item.id || item.platform}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.platform}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditCodingProfile(item)}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Edit coding profile"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCodingProfile(item)}
                          className="p-1 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete coding profile"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10.5px] text-slate-400 dark:text-slate-500">
                        Handle: @{item.username}
                      </span>
                      {item.rating && (
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          Rating: {item.rating}
                        </span>
                      )}
                    </div>

                    {item.solved && (
                      <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">Problems Solved</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {item.solved}
                        </span>
                      </div>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                      >
                        <span>Visit {item.platform} Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 border border-dashed border-slate-700/80 rounded-xl">
                <Terminal className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400">No coding platforms connected yet.</p>
                <button
                  type="button"
                  onClick={onAddCodingProfile}
                  className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
                >
                  + Add LeetCode or CodeChef handle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION 9: SOCIALS
  // ==========================================
  if (activeTab === 'Socials') {
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Share2 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold tracking-tight">Public Profiles & Social Handles</h2>
          </div>
          <button
            type="button"
            onClick={onAddSocial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {socialList.length > 0 ? (
            socialList.map((item) => {
              const platformKey = (item.platform || '').toLowerCase();
              const Icon = PlatformIcons[platformKey] || ExternalLink;
              const isConfigured = Boolean(item.url && item.url.trim());

              return (
                <div
                  key={item.id || item.platform}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        {item.label || item.platform}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block">
                        {item.url || 'Not configured'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isConfigured && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.url, item.id || item.platform)}
                        className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                        title="Copy link"
                      >
                        {copiedLink === (item.id || item.platform) ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    {isConfigured && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onEditSocial(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Edit link"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSocial(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-700/80 rounded-xl">
              <Share2 className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400">No social links added yet.</p>
              <button
                type="button"
                onClick={onAddSocial}
                className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
              >
                + Add GitHub or LinkedIn handle
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
