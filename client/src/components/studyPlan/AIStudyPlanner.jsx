import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  Eye,
  Bot,
  User as UserIcon,
  X
} from 'lucide-react';
import { studyPlanApi } from '../../services/api';
import AIChangePreviewModal from './AIChangePreviewModal';

export default function AIStudyPlanner({
  userName = 'Ritika',
  onPlanUpdated,
  isMobileDrawer = false,
  onCloseDrawer,
  quickTriggerPrompt
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      time: '9:41 PM',
      text: `Hi ${userName}! 👋\n\nI've created a personalized 26-day placement preparation plan based on your profile and target role.\n\nYou can now customize it. Try telling me what you want to add, remove or change.`,
      proposal: null
    },
    {
      id: 2,
      sender: 'user',
      time: '9:42 PM',
      text: 'I want to remove Operating Systems and add more React and JavaScript. Also keep 2 hours on weekdays and 4 hours on weekends.',
      proposal: null
    },
    {
      id: 3,
      sender: 'ai',
      time: '9:43 PM',
      text: `Got it! I'll update your plan.\n\nHere's what I suggest:\n\n❌ Remove\n• Operating Systems (3 sessions)\n\n+ Add\n• React (5 sessions)\n• JavaScript (4 sessions)\n\n⏰ Schedule\n• 2 hours/day (Mon–Fri)\n• 4 hours/day (Sat–Sun)\n\nThis keeps your plan within 26 days and adjusts your focus based on your preference.`,
      proposal: {
        intent: 'modify_plan',
        title: 'Adjusted Placement Roadmap',
        removals: [{ topic: 'Operating Systems', sessionsCount: 3 }],
        additions: [
          { topic: 'React', sessionsCount: 5, duration: '30 min' },
          { topic: 'JavaScript', sessionsCount: 4, duration: '30 min' }
        ],
        schedule: { weekdayHours: 2, weekendHours: 4 },
        timeImpact: 'Fits within your 26-day timeline. Mon-Fri: 2h/d, Sat-Sun: 4h/d.'
      }
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

  useEffect(() => {
    if (quickTriggerPrompt) {
      handleSendMessage(quickTriggerPrompt);
    }
  }, [quickTriggerPrompt]);

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        time: 'Just now',
        text: `Hi ${userName}! 👋\n\nI've reset the consultation. Tell me what you'd like to adjust in your study plan.`,
        proposal: null
      }
    ]);
    setActiveProposal(null);
  };

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || isThinking) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: res.data.reply,
          proposal: res.data.proposal
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (res.data.proposal) {
          setActiveProposal(res.data.proposal);
        }
      }
    } catch (err) {
      console.error('AI chat error:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleApplyChanges = async (proposalToApply) => {
    const proposal = proposalToApply || activeProposal;
    if (!proposal) return;

    try {
      setIsApplying(true);
      const res = await studyPlanApi.applyAiChanges(proposal);

      if (res.success) {
        setFeedbackBanner('Changes successfully applied to your plan!');
        setTimeout(() => setFeedbackBanner(''), 4000);
        setIsPreviewOpen(false);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `✅ **Plan Updated Successfully!**\nYour roadmap and today's tasks have been rebalanced and synced with your Dashboard.`,
            proposal: null
          }
        ]);

        if (onPlanUpdated) {
          onPlanUpdated(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to apply AI changes:', err);
      setFeedbackBanner('Failed to apply changes.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0e1424] border border-slate-800/80 shadow-xl overflow-hidden">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-white">AI Study Planner</h3>
          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            Reset Chat
          </button>
          {isMobileDrawer && (
            <button
              onClick={onCloseDrawer}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-3.5 py-2 border-b border-slate-800/80 text-[11px] text-slate-400 leading-normal">
        Customize your plan using natural language. Add, remove or modify anything.
      </div>

      {feedbackBanner && (
        <div className="px-3 py-1.5 bg-emerald-500/10 border-b border-emerald-500/20 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{feedbackBanner}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div key={msg.id} className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}>
              {isAi && (
                <div className="w-6 h-6 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[88%] space-y-2 ${isAi ? 'text-left' : 'text-right'}`}>
                {/* Bubble */}
                <div
                  className={`p-3 rounded-2xl whitespace-pre-wrap leading-relaxed text-xs shadow-xs ${
                    isAi
                      ? 'bg-[#131b2e] border border-slate-800/80 text-slate-200'
                      : 'bg-[#4338ca] text-white font-medium ml-auto text-left'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Time Stamp */}
                <div className={`text-[10px] text-slate-500 px-1 ${isAi ? 'text-left' : 'text-right'}`}>
                  {msg.time || '9:41 PM'}
                </div>

                {/* Proposal Buttons if message has a proposal */}
                {msg.proposal && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApplyChanges(msg.proposal)}
                      disabled={isApplying}
                      className="py-1.5 px-3 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isApplying ? 'Applying...' : 'Apply Changes'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveProposal(msg.proposal);
                        setIsPreviewOpen(true);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 border border-slate-700/60 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <span>Preview Plan</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-1">
            <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-[11px]">AI analyzing request...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800/80 flex items-center gap-2 bg-[#0e1424]"
      >
        <input
          type="text"
          placeholder="Tell me what you'd like to change..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#131b2e] border border-slate-800/80 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isThinking}
          className="p-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white disabled:opacity-40 transition-colors shrink-0 shadow-xs"
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
