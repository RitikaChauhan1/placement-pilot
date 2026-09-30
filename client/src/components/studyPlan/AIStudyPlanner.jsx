import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  Eye,
  MinusCircle,
  PlusCircle,
  Clock,
  ArrowRight,
  Bot,
  User as UserIcon,
  ChevronDown,
  X
} from 'lucide-react';
import { studyPlanApi } from '../../services/api';
import AIChangePreviewModal from './AIChangePreviewModal';

export default function AIStudyPlanner({
  userName = 'Ritika',
  onPlanUpdated,
  isMobileDrawer = false,
  onCloseDrawer
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hi ${userName} 👋\n\nI’ve created a personalized placement plan based on your profile and target role.\n\nYou can now customize it. Try telling me what you want to add, remove or change.`,
      proposal: null
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeProposal, setActiveProposal] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState('');

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Handle resetting chat
  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Chat reset. What would you like to adjust in your placement plan?`,
        proposal: null
      }
    ]);
    setActiveProposal(null);
  };

  // Quick Action Chips
  const quickActions = [
    { label: 'Add a Topic', prompt: 'I want to add React and JavaScript to my preparation plan.' },
    { label: 'Remove a Topic', prompt: 'Remove Operating Systems from my study plan.' },
    { label: 'Adjust Study Time', prompt: 'Keep 2 hours on weekdays and 4 hours on weekends.' },
    { label: 'Focus on Weak Areas', prompt: 'Focus on my weak areas: Binary Search and SQL Joins.' },
  ];

  // Send message to AI
  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || isThinking) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      proposal: null
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const res = await studyPlanApi.aiChat(queryText);

      if (res.success && res.data) {
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.data.reply,
          proposal: res.data.proposal
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (res.data.proposal) {
          setActiveProposal(res.data.proposal);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: 'I understood your request. Let me formulate a plan proposal for you shortly.',
            proposal: null
          }
        ]);
      }
    } catch (err) {
      console.error('AI chat failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Sorry, I encountered an issue planning your changes. Please try again.',
          proposal: null
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Apply Changes to Backend
  const handleApplyChanges = async (proposalToApply) => {
    const proposal = proposalToApply || activeProposal;
    if (!proposal) return;

    try {
      setIsApplying(true);
      const res = await studyPlanApi.applyAiChanges(proposal);

      if (res.success) {
        setFeedbackBanner('Changes successfully applied to your active study plan!');
        setTimeout(() => setFeedbackBanner(''), 4000);
        setIsPreviewOpen(false);

        // Append confirmation in chat
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            sender: 'ai',
            text: `✅ **Plan Updated Successfully!**\nYour roadmap and today's tasks are now updated and synchronized with your Dashboard.`,
            proposal: null
          }
        ]);

        if (onPlanUpdated) {
          onPlanUpdated(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to apply AI plan changes:', err);
      setFeedbackBanner('Failed to apply changes. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-card border border-border/80 shadow-md overflow-hidden">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-border/70 flex items-center justify-between bg-card/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">AI Study Planner</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                Beta
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              Continuous adaptive placement guidance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs flex items-center gap-1"
            title="Reset Chat"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline text-[10px]">Reset</span>
          </button>
          {isMobileDrawer && (
            <button
              onClick={onCloseDrawer}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description Banner */}
      <div className="px-3.5 py-2 bg-primary/5 border-b border-primary/10 text-[11px] text-muted-foreground">
        Customize your plan using natural language. Add, remove or modify anything.
      </div>

      {/* Feedback Toast */}
      {feedbackBanner && (
        <div className="px-3 py-1.5 bg-emerald-500/10 border-b border-emerald-500/20 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{feedbackBanner}</span>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div key={msg.id} className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                  isAi
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-accent/20 text-accent border border-accent/30'
                }`}
              >
                {isAi ? <Bot className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[85%] space-y-2 ${isAi ? 'text-left' : 'text-right'}`}>
                {/* Text Bubble */}
                <div
                  className={`p-3 rounded-2xl whitespace-pre-wrap leading-relaxed text-xs shadow-xs ${
                    isAi
                      ? 'bg-muted/40 border border-border/70 text-foreground rounded-tl-xs'
                      : 'bg-primary text-primary-foreground font-medium rounded-tr-xs ml-auto text-left'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Structured Change Proposal Card if present */}
                {msg.proposal && (
                  <div className="p-3 rounded-xl bg-card border border-primary/30 shadow-md text-left space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-primary border-b border-border/50 pb-1.5">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Proposed Plan Modifications
                      </span>
                    </div>

                    {/* Removals */}
                    {msg.proposal.removals && msg.proposal.removals.length > 0 && (
                      <div className="text-[11px] space-y-1">
                        <span className="font-bold text-red-400 flex items-center gap-1">
                          <MinusCircle className="w-3 h-3" />
                          Remove
                        </span>
                        {msg.proposal.removals.map((r, i) => (
                          <div key={i} className="pl-4 text-foreground/90">
                            • {r.topic} ({r.sessionsCount} sessions)
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Additions */}
                    {msg.proposal.additions && msg.proposal.additions.length > 0 && (
                      <div className="text-[11px] space-y-1">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <PlusCircle className="w-3 h-3" />
                          Add
                        </span>
                        {msg.proposal.additions.map((a, i) => (
                          <div key={i} className="pl-4 text-foreground/90">
                            • {a.topic} ({a.sessionsCount} sessions)
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Schedule */}
                    {msg.proposal.schedule && (
                      <div className="text-[11px] space-y-0.5">
                        <span className="font-bold text-purple-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Schedule
                        </span>
                        <div className="pl-4 text-foreground/90">
                          • {msg.proposal.schedule.weekdayHours} hours/day Monday–Friday
                        </div>
                        <div className="pl-4 text-foreground/90">
                          • {msg.proposal.schedule.weekendHours} hours/day Saturday–Sunday
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-border/50 flex items-center gap-2">
                      <button
                        onClick={() => handleApplyChanges(msg.proposal)}
                        disabled={isApplying}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isApplying ? 'Applying...' : 'Apply Changes'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveProposal(msg.proposal);
                          setIsPreviewOpen(true);
                        }}
                        className="py-1.5 px-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-border"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Plan</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking State */}
        {isThinking && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
            <Bot className="w-4 h-4 text-primary animate-pulse" />
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[11px]">AI analyzing preparation parameters...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Chips Footer */}
      <div className="p-2 border-t border-border/60 bg-muted/20">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {quickActions.map((qa) => (
            <button
              key={qa.label}
              onClick={() => handleSendMessage(qa.prompt)}
              className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-card hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 text-muted-foreground whitespace-nowrap transition-colors"
            >
              {qa.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-border/70 flex items-center gap-2 bg-card"
      >
        <input
          type="text"
          placeholder="Ask AI: e.g. Add React, remove OS..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isThinking}
          className="p-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 transition-colors shrink-0 shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Diff Preview Modal */}
      <AIChangePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        proposal={activeProposal}
        onApply={() => handleApplyChanges(activeProposal)}
        isApplying={isApplying}
      />
    </div>
  );
}
