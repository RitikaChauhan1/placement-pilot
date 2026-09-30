import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Clock, TrendingUp, Filter, Sparkles, AlertCircle } from 'lucide-react';
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
        setFeedbackMsg(`Successfully added "${confirmModalTopic.name}" to your preparation roadmap!`);
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
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics, questions, companies, or resources (e.g. React, Binary Search, SQL Joins)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Success Notification Banner */}
      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400 font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Topics Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">Searching catalog...</div>
      ) : topics.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-card border border-dashed border-border text-xs text-muted-foreground">
          No matching topics found for "{searchQuery}". Try searching for DSA, React, or SQL.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {topics.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {t.category}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {t.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground mt-2 line-clamp-1">
                  {t.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {t.description}
                </p>

                <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    {t.suggestedSessions} sessions • {t.minutesPerSession}m
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-foreground/80">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    +{t.impactWeeklyHours}h/week
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50">
                <button
                  onClick={() => setConfirmModalTopic(t)}
                  disabled={addingTopicId === t.id}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog matching Section 12 */}
      {confirmModalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Add {confirmModalTopic.name}?
              </h3>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Suggested Schedule:</span>
                  <span className="font-semibold text-foreground">
                    {confirmModalTopic.suggestedSessions} sessions ({confirmModalTopic.minutesPerSession} min/session)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Time Impact:</span>
                  <span className="font-semibold text-emerald-400">
                    +{confirmModalTopic.impactWeeklyHours} hours/week
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                This will integrate {confirmModalTopic.name} into your active roadmap phase and schedule a session in your daily tasks.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-5">
              <button
                type="button"
                onClick={() => setConfirmModalTopic(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                disabled={addingTopicId === confirmModalTopic.id}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
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
