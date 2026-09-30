import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Globe, Share2, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-[#070a10] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Placement<span className="text-brand-600 dark:text-brand-400">Pilot</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering college students with structured preparation, targeted practice, and confidence to crack their dream campus placement offers.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-500 dark:text-slate-400">
              <span className="p-1.5 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" title="Global Community">
                <Globe className="w-3.5 h-3.5" />
              </span>
              <span className="p-1.5 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" title="Placement Resources">
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              <span className="p-1.5 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" title="Share with Classmates">
                <Share2 className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Platform modules */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2.5">
              Prep Modules
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/study-plan" className="hover:text-brand-600 dark:hover:text-white transition-colors">Personalized Study Plan</Link></li>
              <li><Link to="/dsa" className="hover:text-brand-600 dark:hover:text-white transition-colors">DSA Topic Sheets</Link></li>
              <li><Link to="/sql" className="hover:text-brand-600 dark:hover:text-white transition-colors">SQL Query Playground</Link></li>
              <li><Link to="/mock-interviews" className="hover:text-brand-600 dark:hover:text-white transition-colors">Mock Technical Interviews</Link></li>
            </ul>
          </div>

          {/* Target Companies */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2.5">
              Target Drives
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="hover:text-brand-600 dark:hover:text-white cursor-pointer transition-colors">Accenture Advanced ASE & ASE</li>
              <li className="hover:text-brand-600 dark:hover:text-white cursor-pointer transition-colors">TCS Digital & Ninja</li>
              <li className="hover:text-brand-600 dark:hover:text-white cursor-pointer transition-colors">Cognizant GenC Elevate</li>
              <li className="hover:text-brand-600 dark:hover:text-white cursor-pointer transition-colors">Product Companies (Tier-1)</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2.5">
              Quick Links
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/login" className="hover:text-brand-600 dark:hover:text-white transition-colors">Student Login</Link></li>
              <li><Link to="/signup" className="hover:text-brand-600 dark:hover:text-white transition-colors">Register as Student</Link></li>
              <li><a href="#about" className="hover:text-brand-600 dark:hover:text-white transition-colors">About the Project</a></li>
              <li><a href="#features" className="hover:text-brand-600 dark:hover:text-white transition-colors">Key Features</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} PlacementPilot. Campus Placement Platform.</p>
          <div className="flex items-center gap-2">
            <span>Engineering Placements</span>
            <span>•</span>
            <span className="text-brand-600 dark:text-brand-400 font-medium">Ready for Academic Drives</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


