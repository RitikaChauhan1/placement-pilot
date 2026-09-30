import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Code2,
  Database,
  Award,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Target,
      title: 'Company-Specific Targeting',
      description: 'Prepare tailored patterns for top hiring companies including Accenture, TCS, Cognizant, Google, and Amazon.',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      icon: Code2,
      title: 'Curated DSA & Coding Roadmaps',
      description: 'Master essential data structures and algorithms with topic-wise placement problem sets and complexity breakdowns.',
      color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      icon: Database,
      title: 'Core CS & SQL Foundations',
      description: 'Strengthen DBMS queries, Operating System concepts, Computer Networks, and OOPs for campus technical rounds.',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      icon: TrendingUp,
      title: 'Readiness Analytics & Tasks',
      description: 'Track your preparation score, daily checklists, and countdown to on-campus placement drive dates.',
      color: 'bg-amber-500/10 text-amber-600',
    },
  ];

  const targetCompanies = [
    'Accenture', 'TCS', 'Google', 'Microsoft', 'Cognizant', 'Amazon', 'Infosys', 'Wipro'
  ];

  return (
    <div id="home" className="space-y-12 sm:space-y-16 pb-12 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-slate-50 dark:from-[#0b0f17] dark:via-[#0e1422] dark:to-[#0b0f17] border-b border-slate-200/60 dark:border-slate-800/80 transition-colors">
        {/* Background decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-tr from-brand-300/20 to-indigo-300/15 dark:from-brand-500/10 dark:to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-[11px] font-semibold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Campus Placement Preparation Platform</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Ace Your Upcoming <br />
                <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 dark:from-brand-400 dark:via-indigo-400 dark:to-brand-300 bg-clip-text text-transparent">
                  Campus Placements
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                PlacementPilot is the focused, structured companion for college students. Streamline your technical interview prep, DSA practice, core engineering subjects, and company drives in one unified cockpit.
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/signup"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 rounded-lg shadow-sm shadow-brand-500/20 transition-all cursor-pointer"
                >
                  <span>Start Preparing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg shadow-subtle transition-all"
                >
                  <span>Explore Platform</span>
                </a>
              </div>

              {/* Highlights strip */}
              <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>College Placement Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time Readiness Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Free Foundation</span>
                </div>
              </div>
            </div>

            {/* Right Hero Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium dark:shadow-none p-4 space-y-4 transition-colors">
                {/* Header snippet */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      RP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Placement Pilot Cockpit</h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Targeting: SDE-1 / Associate Engineer</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    Active Drive
                  </span>
                </div>

                {/* Target Company & Countdown */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Target Company</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Accenture / Google</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Drive Countdown</span>
                    <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-0.5">28 Days Left</p>
                  </div>
                </div>

                {/* Readiness Gauge Mock */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">Interview Readiness Score</span>
                    <span className="text-brand-600 dark:text-brand-400">74%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full w-3/4 transition-all" />
                  </div>
                </div>

                {/* Sample Daily Tasks */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Today's Placement Tasks</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 p-1.5 rounded-md bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="line-through text-slate-500 dark:text-slate-400 text-[11.5px]">Solve 3 Dynamic Programming problems</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300">
                      <div className="w-3.5 h-3.5 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0" />
                      <span className="text-[11.5px]">Review SQL Joins & Normalization</span>
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-center">
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                  >
                    <span>Create your student account now</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Companies Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Engineered for Campus Recruitment Drives at Top Employers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
            {targetCompanies.map((company) => (
              <div
                key={company}
                className="px-3 py-1 bg-white dark:bg-[#111827] rounded-md border border-slate-200/80 dark:border-slate-800 shadow-2xs text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Platform Capabilities
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Everything You Need for Campus Hiring
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            A clean, clutter-free system designed specifically to bridge the gap between classroom theory and real corporate technical interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-subtle dark:shadow-none hover:shadow-card hover:border-brand-200 dark:hover:border-brand-700/60 transition-all group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${f.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{f.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-slate-900 dark:bg-[#111827] border border-slate-800 dark:border-slate-800/90 rounded-2xl text-white p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[11px] font-semibold tracking-wide border border-brand-400/20">
              About PlacementPilot
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              Built by Engineers, Dedicated to Tomorrow's Graduates
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Campus placement season can be stressful: juggling college exams, aptitude tests, Data Structures, core engineering subjects, and interview preparation simultaneously. 
              <br /><br />
              PlacementPilot simplifies this chaos by offering a structured dashboard where students can set their target roles, track daily progress, monitor readiness metrics, and follow clear milestones step by step.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
              <div>
                <p className="text-lg sm:text-xl font-bold text-brand-400">100%</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Free Foundation for Students</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-brand-400">30+ Days</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Structured Drive Roadmap</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-brand-400">Full-Stack</p>
                <p className="text-[11px] text-slate-400 mt-0.5">PostgreSQL & Express REST</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Got Questions?</h2>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          <div className="bg-white dark:bg-[#111827] p-4 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Who is PlacementPilot designed for?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              It is tailored for college students in B.Tech, MCA, BCA, and related degrees preparing for on-campus and off-campus placements in software engineering, analyst, and cloud developer roles.
            </p>
          </div>
          <div className="bg-white dark:bg-[#111827] p-4 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">How does the Readiness Percentage work?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Your readiness percentage is calculated based on completed daily tasks, solved DSA topics, and profile milestones set in your student dashboard.
            </p>
          </div>
          <div className="bg-white dark:bg-[#111827] p-4 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Will AI mock interviews and resume analysis be added?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Yes! This release establishes the robust foundation, authentication, profile management, and dashboard navigation. Advanced AI features will be introduced incrementally in upcoming releases.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 rounded-2xl p-6 sm:p-8 text-center text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">Ready to secure your placement offer?</h3>
            <p className="text-brand-100 text-xs sm:text-sm">
              Set up your student profile in less than 2 minutes and start tracking your preparation today.
            </p>
            <div className="pt-1">
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-brand-700 hover:bg-slate-50 font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <span>Get Started - It's Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

