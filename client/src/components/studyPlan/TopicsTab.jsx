import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Clock, TrendingUp } from 'lucide-react';
import { studyPlanApi } from '../../services/api';

export default function TopicsTab({ onTopicAdded }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModalTopic, setConfirmModalTopic] = useState(null);
  const [addingTopicId, setAddingTopicId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const categories = ['All', 'DSA', 'SQL', 'Core CS', 'Frontend', 'Aptitude', 'Mock Interview'];

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await studyPlanApi.searchTopics({
        q: searchQuery,
        category: selectedCategory
      });
      if (res.success && res.topics) {
        setTopics(res.topics);
      }
    } catch (err) {
      console.error('Failed to search topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [searchQuery, selectedCategory]);

  const handleConfirmAdd = async () => {
    if (!confirmModalTopic) return;
    try {
      setAddingTopicId(confirmModalTopic.id);
      const res = await studyPlanApi.addTopicToPlan({
        topicId: confirmModalTopic.id,
        topicName: confirmModalTopic.name,
        category: confirmModalTopic.category,
        duration: `${confirmModalTopic.minutesPerSession || 30} min`,
        sessionsCount: confirmModalTopic.suggestedSessions || 3
      });

      if (res.success) {
        setFeedbackMsg(`Successfully added "${confirmModalTopic.name}" to your plan!`);
        setTimeout(() => setFeedbackMsg(''), 4000);
        if (onTopicAdded) onTopicAdded(res.task);
      }
      setConfirmModalTopic(null);
    } catch (err) {
      console.error('Failed to add topic to plan:', err);
    } finally {
      setAddingTopicId(null);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Search Header */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          placeholder="Search topics, questions, companies, or resources (e.g. React, Binary Search, SQL Joins)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0e1424] border border-slate-800/80 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs sm:text-sm"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1d4ed8] text-white shadow-xs'
                : 'bg-[#0e1424] border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Topics Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Searching catalog...</div>
      ) : topics.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#0e1424] border border-slate-800/80 text-xs text-slate-400">
          No matching topics found for "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/25">
                    {t.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {t.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2 line-clamp-1">
                  {t.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {t.description}
                </p>

                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {t.suggestedSessions} sessions • {t.minutesPerSession}m
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    +{t.impactWeeklyHours}h/week
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => setConfirmModalTopic(t)}
                  disabled={addingTopicId === t.id}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#11192e] hover:bg-[#16223d] text-slate-200 border border-slate-700/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                  <span>Add to Plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Add {confirmModalTopic.name}?
            </h3>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Suggested Schedule:</span>
                  <span className="font-semibold text-white">
                    {confirmModalTopic.suggestedSessions} sessions ({confirmModalTopic.minutesPerSession} min/session)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Time Impact:</span>
                  <span className="font-semibold text-emerald-400">
                    +{confirmModalTopic.impactWeeklyHours} hours/week
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800 mt-5">
              <button
                type="button"
                onClick={() => setConfirmModalTopic(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                disabled={addingTopicId === confirmModalTopic.id}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white"
              >
                {addingTopicId === confirmModalTopic.id ? 'Adding...' : 'Add to Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
