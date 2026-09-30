import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Code2,
  ExternalLink,
  Clock,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { studyPlanApi } from '../../services/api';

export default function ResourcesTab() {
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'DSA', 'SQL', 'Core CS', 'Frontend', 'Aptitude', 'Mock Interview'];

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await studyPlanApi.getResources(selectedCategory);
      if (res.success && res.resources) {
        setResources(res.resources);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video':
        return <Video className="w-3.5 h-3.5 text-red-400" />;
      case 'Practice Questions':
      case 'Company Questions':
        return <Code2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'Documentation':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Notes':
      case 'Article':
      default:
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Pills */}
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

      {/* Resources List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">Loading curated placement resources...</div>
      ) : resources.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-card border border-dashed border-border text-xs text-muted-foreground">
          No resources found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {resources.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    {getTypeIcon(item.type)}
                    <span>{item.type}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                    {item.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground mt-2 line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    ~{item.estimatedMinutes} mins
                  </span>
                  <span>•</span>
                  <span>Source: {item.source}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] font-medium text-primary">
                  {item.category}
                </span>

                <Link
                  to={item.route || '/study-plan'}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition-colors"
                >
                  <span>Open Resource</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
