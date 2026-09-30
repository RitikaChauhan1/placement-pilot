import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import {
  Compass,
  User,
  Mail,
  Lock,
  GraduationCap,
  Building2,
  Briefcase,
  AlertCircle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: 'National Institute of Technology',
    degree: 'B.Tech in Computer Science',
    graduation_year: '2026',
    target_role: 'Software Development Engineer (SDE-1)'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password validation helper
  const hasMinLength = formData.password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields (Full name, Email, Password, and Confirm password).');
      return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid email address (e.g. user@example.com).');
      return;
    }

    // Password strength validation
    if (!hasMinLength || !hasLetter || !hasNumber) {
      setError('Password must be at least 8 characters long and contain at least one letter and one number.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-8 sm:px-6 lg:px-8 relative transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle size="sm" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Placement<span className="text-brand-600 dark:text-brand-400">Pilot</span>
          </span>
        </Link>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create Your Account
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Sign up to access your placement roadmap and practice modules
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm px-4 sm:px-0">
        <div className="bg-white dark:bg-[#111827] py-6 px-5 sm:px-6 shadow-card dark:shadow-none rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-[11.5px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11.5px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11.5px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars (letters & numbers)"
                  required
                  className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11.5px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Strength Requirement Checklist */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-1 text-[11.5px]">
              <p className="font-semibold text-slate-600 dark:text-slate-300 mb-0.5">Password Requirements:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${hasMinLength ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${(hasLetter && hasNumber) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${(hasLetter && hasNumber) ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>Letters & numbers</span>
                </div>
                {formData.confirmPassword && (
                  <div className={`flex items-center gap-1.5 col-span-full ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-500 dark:text-rose-400'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${passwordsMatch ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-400'}`} />
                    <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-60 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Login Redirect */}
        <p className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}


