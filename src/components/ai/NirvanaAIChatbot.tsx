'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User as UserIcon, 
  ArrowRight, 
  Compass, 
  Briefcase, 
  FileText, 
  Radio, 
  Minimize2, 
  Maximize2,
  BookOpen,
  HelpCircle 
} from 'lucide-react';
import { aiService, ChatMessage } from '@/lib/ai/aiService';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

export function NirvanaAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      content: "Hello! I am Nirvana AI, your intelligent technology companion. I can navigate the site for you, recommend internships, generate live quizzes, analyze code, and prepare you for interviews. How can I help you excel today?",
      timestamp: 'Now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { currentUser } = useAuth();

  // Listen to custom toggle events from navbar or command palette
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-nirvana-ai', handleToggle);
    return () => window.removeEventListener('toggle-nirvana-ai', handleToggle);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const executeToolCall = (toolCall: NonNullable<ChatMessage['toolCall']>) => {
    soundEffects.playClick();
    if (toolCall.action === 'filter_opportunities') {
      const type = toolCall.payload.type || 'all';
      const q = toolCall.payload.query || '';
      router.push(`/opportunities?type=${type}${q ? `&query=${encodeURIComponent(q)}` : ''}`);
      setIsOpen(false);
    } else if (toolCall.action === 'filter_events') {
      const cat = toolCall.payload.category || '';
      router.push(`/events${cat ? `?category=${encodeURIComponent(cat)}` : ''}`);
      setIsOpen(false);
    } else if (toolCall.action === 'create_quiz') {
      const topic = toolCall.payload.topic || 'Web Tech';
      router.push(`/live/create?topic=${encodeURIComponent(topic)}`);
      setIsOpen(false);
    } else if (toolCall.action === 'navigate') {
      router.push(toolCall.payload.url);
      setIsOpen(false);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || input).trim();
    if (!promptToSend || isLoading) return;

    soundEffects.playClick();
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await aiService.processChat(promptToSend, messages, currentUser);
      setMessages(prev => [...prev, aiResponse]);
      soundEffects.playSuccess();

      // If tool call exists, auto highlight
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          content: "I'm having a momentary sync issue. Please try your request again.",
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            soundEffects.playClick();
            setIsOpen(true);
          }}
          className="animate-float glow-border"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-nirvana)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-cyan-glow)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          <Sparkles size={19} className="animate-pulse-glow" />
          <span>Ask Nirvana AI</span>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className="glass-card"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            width: isExpanded ? '640px' : '390px',
            height: isExpanded ? '720px' : '560px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 40px)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-glow)',
            overflow: 'hidden',
            transition: 'width 0.2s ease, height 0.2s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--gradient-nirvana)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(6, 182, 212, 0.4)',
                }}
              >
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Nirvana AI
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    Companion
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  Tool-Calling Online
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn-ghost"
                title={isExpanded ? 'Collapse' : 'Expand'}
                style={{ padding: '6px', borderRadius: '4px' }}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-ghost"
                title="Close"
                style={{ padding: '6px', borderRadius: '4px' }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '8px 12px',
              overflowX: 'auto',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(0,0,0,0.15)',
              scrollbarWidth: 'none',
            }}
          >
            <button
              onClick={() => handleSend('Guide me through how to use TYGN platform features')}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}
            >
              <HelpCircle size={12} /> Platform Guide
            </button>
            <button
              onClick={() => handleSend('How do I access the B.Tech Notes Drive?')}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '12px' }}
            >
              <BookOpen size={12} /> Notes Drive
            </button>
            <button
              onClick={() => handleSend('Guide me through the AI Resume Analyzer with PDF/Image')}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '12px' }}
            >
              <FileText size={12} /> Resume Analyzer
            </button>
            <button
              onClick={() => handleSend('How to join a Nirvana Live Quiz?')}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '12px' }}
            >
              <Radio size={12} /> Live Quizzes
            </button>
            <button
              onClick={() => handleSend('Show me tech internships')}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '12px' }}
            >
              <Briefcase size={12} /> Internships
            </button>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.role === 'assistant' && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--gradient-nirvana)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Bot size={15} color="#fff" />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.88rem',
                      lineHeight: '1.45',
                      background: msg.role === 'user' ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.06)',
                      color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                      border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                      boxShadow: msg.role === 'user' ? '0 2px 10px rgba(99, 102, 241, 0.3)' : 'none',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}

                    {/* Render Tool Call Action Card if available */}
                    {msg.toolCall && (
                      <div
                        style={{
                          marginTop: '10px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(6, 182, 212, 0.1)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#22d3ee', fontWeight: 600 }}>
                          <Sparkles size={14} />
                          {msg.toolCall.displayText}
                        </div>
                        <button
                          onClick={() => executeToolCall(msg.toolCall!)}
                          className="btn-primary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          Execute <ArrowRight size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <UserIcon size={14} color="var(--text-primary)" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--gradient-nirvana)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={15} color="#fff" />
                </div>
                <div
                  className="badge badge-indigo animate-pulse-glow"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Nirvana AI is thinking & reasoning...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Ask anything or request site actions..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="btn-primary"
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                opacity: isLoading || !input.trim() ? 0.6 : 1,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
