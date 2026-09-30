import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Code2, Database, Building2, BookOpen, X, ArrowRight } from 'lucide-react';

const SEARCH_DATABASE = [
  // Topics
  { title: 'Binary Search Patterns', category: 'Topic', route: '/dsa', icon: Code2 },
  { title: 'Dynamic Programming & Memoization', category: 'Topic', route: '/dsa', icon: Code2 },
  { title: 'SQL Joins & Aggregations', category: 'Topic', route: '/sql', icon: Database },
  { title: 'Database Indexing & B-Trees', category: 'Topic', route: '/study-plan', icon: Database },
  { title: 'OS Process Scheduling & Threads', category: 'Topic', route: '/study-plan', icon: BookOpen },

  // DSA Problems
  { title: 'Two Sum & 3Sum', category: 'DSA Problem', route: '/dsa', icon: Code2 },
  { title: 'Subarray Sum Equals K', category: 'DSA Problem', route: '/dsa', icon: Code2 },
  { title: 'Binary Tree Level Order Traversal', category: 'DSA Problem', route: '/dsa', icon: Code2 },
  { title: 'Longest Palindromic Substring', category: 'DSA Problem', route: '/dsa', icon: Code2 },

  // SQL Questions
  { title: 'Nth Highest Salary Query', category: 'SQL Question', route: '/sql', icon: Database },
  { title: 'Department Highest Salary', category: 'SQL Question', route: '/sql', icon: Database },
  { title: 'Consecutive Available Numbers', category: 'SQL Question', route: '/sql', icon: Database },

  // Companies
  { title: 'Accenture Placement Sheet', category: 'Company', route: '/study-plan', icon: Building2 },
  { title: 'Google Technical Interview Kit', category: 'Company', route: '/study-plan', icon: Building2 },
  { title: 'Microsoft SDE Preparation Track', category: 'Company', route: '/study-plan', icon: Building2 },

  // Resources
  { title: 'Operating Systems Cheat Sheet', category: 'Resource', route: '/study-plan', icon: BookOpen },
  { title: 'DBMS ACID & Normalization Notes', category: 'Resource', route: '/study-plan', icon: BookOpen },
  { title: 'System Design Primer for Campus', category: 'Resource', route: '/study-plan', icon: BookOpen },
];

export default function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filtered = query.trim()
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (route) => {
    setIsOpen(false);
    setQuery('');
    navigate(route);
  };

  return (
    <div ref={containerRef} className="relative w-44 sm:w-60 md:w-72">
      {/* Search Bar Input */}
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search topics, DSA, SQL..."
          aria-label="Search topics, problems, SQL, companies, resources"
          className="w-full pl-8 pr-7 py-1 text-xs bg-slate-100/80 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-lg outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-fadeIn text-xs">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex justify-between">
            <span>Results for "{query}"</span>
            <span>{filtered.length} found</span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-slate-400 dark:text-slate-500 text-xs">
                No matching topics or questions found.
              </div>
            ) : (
              filtered.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(item.route)}
                    className="w-full p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-400 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
