import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';

/**
 * Custom SVG icons for major developer and competitive coding platforms
 */
export const PlatformIcons = {
  github: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  linkedin: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  ),
  leetcode: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .271 3.543 5.437 5.437 0 0 0 1.458 2.012l.142.118a5.357 5.357 0 0 0 1.83 1.056c.414.135.845.204 1.282.204a5.32 5.32 0 0 0 3.784-1.572l3.774-3.79a1.376 1.376 0 0 0-.974-2.35 1.365 1.365 0 0 0-.97.404l-3.774 3.79a2.584 2.584 0 0 1-1.836.763 2.613 2.613 0 0 1-2.483-1.802 2.67 2.67 0 0 1 .697-2.732l3.854-4.126 5.406-5.788A1.37 1.37 0 0 0 13.483 0zm2.983 12.03a1.37 1.37 0 0 0-1.37 1.37v.03a1.37 1.37 0 0 0 1.37 1.37h4.86a1.37 1.37 0 0 0 1.37-1.37v-.03a1.37 1.37 0 0 0-1.37-1.37h-4.86z" />
    </svg>
  ),
  geeksforgeeks: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 14.8c-2.3 0-3.9-1.7-3.9-4.2s1.6-4.2 3.9-4.2c1.3 0 2.4.6 3 1.6l-1.5 1c-.4-.6-.9-.9-1.5-.9-1.3 0-2.1 1-2.1 2.5s.8 2.5 2.1 2.5c.7 0 1.2-.3 1.6-.9l1.5.9c-.7 1.1-1.8 1.7-3.1 1.7zm5.6 0c-1.3 0-2.4-.6-3-1.7l1.5-.9c.4.6.9.9 1.5.9 1.3 0 2.1-1 2.1-2.5s-.8-2.5-2.1-2.5c-.6 0-1.1.3-1.5.9l-1.5-1c.6-1 1.7-1.6 3-1.6 2.3 0 3.9 1.7 3.9 4.2s-1.6 4.2-3.9 4.2z" />
    </svg>
  ),
  codechef: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.83 14.83c-1.24 1.24-2.88 1.92-4.63 1.92-3.62 0-6.56-2.94-6.56-6.56s2.94-6.56 6.56-6.56c1.76 0 3.4.68 4.63 1.92l-1.42 1.42c-.86-.86-2-1.34-3.21-1.34-2.51 0-4.56 2.05-4.56 4.56s2.05 4.56 4.56 4.56c1.21 0 2.35-.48 3.21-1.34l1.42 1.42z" />
    </svg>
  ),
};

export default function ProfileSocialLinks({ socials = {}, size = 'md', className = '' }) {
  if (!socials || typeof socials !== 'object') return null;

  const platforms = [
    {
      key: 'github',
      name: 'GitHub',
      url: socials.github,
      icon: PlatformIcons.github,
      hoverColor: 'hover:text-[#24292F] dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600',
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      url: socials.linkedin,
      icon: PlatformIcons.linkedin,
      hoverColor: 'hover:text-[#0A66C2] dark:hover:text-[#70b5f9] hover:border-[#0A66C2]/40',
    },
    {
      key: 'leetcode',
      name: 'LeetCode',
      url: socials.leetcode,
      icon: PlatformIcons.leetcode,
      hoverColor: 'hover:text-[#FFA116] dark:hover:text-[#FFA116] hover:border-[#FFA116]/40',
    },
    {
      key: 'gfg',
      name: 'GeeksForGeeks',
      url: socials.gfg || socials.geeksforgeeks,
      icon: PlatformIcons.geeksforgeeks,
      hoverColor: 'hover:text-[#2F8D46] dark:hover:text-[#52c26d] hover:border-[#2F8D46]/40',
    },
    {
      key: 'codechef',
      name: 'CodeChef',
      url: socials.codechef,
      icon: PlatformIcons.codechef,
      hoverColor: 'hover:text-[#8B5A2B] dark:hover:text-[#d4a373] hover:border-[#8B5A2B]/40',
    },
    {
      key: 'portfolio',
      name: 'Portfolio',
      url: socials.portfolio || socials.website,
      icon: (props) => <Globe {...props} />,
      hoverColor: 'hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/40',
    },
  ];

  // Filter: Only show platforms that the user has actually configured
  const configured = platforms.filter((item) => Boolean(item.url && item.url.trim()));

  if (configured.length === 0) {
    return (
      <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
        No social links configured yet
      </span>
    );
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const btnPaddings = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {configured.map((item) => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${item.name} Profile`}
            aria-label={item.name}
            className={`group inline-flex items-center justify-center rounded-lg bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 transition-all duration-150 shadow-2xs hover:scale-105 active:scale-95 ${btnPaddings[size]} ${item.hoverColor}`}
          >
            <IconComponent className={`${iconSizes[size]} transition-colors`} />
          </a>
        );
      })}
    </div>
  );
}
