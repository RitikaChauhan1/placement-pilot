import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';
import ThemeToggle from '../components/common/ThemeToggle';
import {
  Compass,
  Mail,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.forgotPassword(email);
      if (res.success) {
        setStatusMessage(res.message || 'Password reset functionality will be available soon.');
      }
    } catch (err) {
      setError(err.message || 'Unable to submit request. Please try again.');
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
          Reset Password
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Enter your registered email address to recover your account
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

          {statusMessage ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
                <Info className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-950 dark:text-blue-100 mb-0.5">Notice</p>
                  <p className="leading-relaxed">{statusMessage}</p>
                </div>
              </div>

              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                For security reasons during the MVP phase, automated password reset emails are scheduled for the next release. If you need urgent access, please register a new pilot account or use the sample credentials on the login screen.
              </p>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11.5px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-60 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Reset Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

