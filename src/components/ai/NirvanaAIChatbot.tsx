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
  const { currentUser, isAuthenticated } = useAuth();

  const handleOpen = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    soundEffects.playClick();
    setIsOpen(true);
  };

  // Close if unauthenticated
  useEffect(() => {
    if (!isAuthenticated && isOpen) {
      setIsOpen(false);
    }
  }, [isAuthenticated, isOpen]);

  // Listen to custom toggle events from navbar or command palette
  useEffect(() => {
    const handleToggle = () => {
      if (!isAuthenticated) {
        router.push('/login?redirect=/dashboard');
        return;
      }
      setIsOpen(prev => !prev);
    };
    window.addEventListener('toggle-nirvana-ai', handleToggle);
    return () => window.removeEventListener('toggle-nirvana-ai', handleToggle);
  }, [isAuthenticated, router]);

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
          onClick={handleOpen}
          aria-label="Ask Nirvana AI"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '9999px',
            background: '#ffffff',
            color: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '0.82rem',
            letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
          }}
        >
          <Sparkles size={16} color="#000000" />
          <span>ASK NIRVANA AI</span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#000000',
            }}
          />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            width: isExpanded ? '640px' : '400px',
            height: isExpanded ? '720px' : '580px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 40px)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: '#0a0a0a',
            borderRadius: '16px',
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
              background: '#0d0d0d',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} color="#000000" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  NIRVANA AI
                  <span style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.05)', color: '#a3a3a3', letterSpacing: '0.05em' }}>
                    INTELLIGENCE
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#737373', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                  Autonomous Model
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn-ghost"
                title={isExpanded ? 'Collapse' : 'Expand'}
                style={{ padding: '6px', borderRadius: '6px', color: '#a3a3a3' }}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-ghost"
                title="Close"
                style={{ padding: '6px', borderRadius: '6px', color: '#a3a3a3' }}
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
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#080808',
              scrollbarWidth: 'none',
            }}
          >
            <button
              onClick={() => handleSend('Guide me through how to use TYGN platform features')}
              style={{ fontSize: '0.72rem', padding: '5px 10px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <HelpCircle size={12} /> Platform Guide
            </button>
            <button
              onClick={() => handleSend('How do I access the B.Tech Notes Drive?')}
              style={{ fontSize: '0.72rem', padding: '5px 10px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a3a3a3', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <BookOpen size={12} /> Notes Drive
            </button>
            <button
              onClick={() => handleSend('Guide me through the AI Resume Analyzer with PDF/Image')}
              style={{ fontSize: '0.72rem', padding: '5px 10px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a3a3a3', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <FileText size={12} /> Resume Analyzer
            </button>
            <button
              onClick={() => handleSend('How to join a Nirvana Live Quiz?')}
              style={{ fontSize: '0.72rem', padding: '5px 10px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a3a3a3', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <Radio size={12} /> Live Quizzes
            </button>
            <button
              onClick={() => handleSend('Show me tech internships')}
              style={{ fontSize: '0.72rem', padding: '5px 10px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a3a3a3', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', cursor: 'pointer' }}
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
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Bot size={15} color="#000000" />
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
                      padding: '11px 15px',
                      borderRadius: '12px',
                      fontSize: '0.86rem',
                      lineHeight: '1.5',
                      background: msg.role === 'user' ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                      color: msg.role === 'user' ? '#000000' : '#e5e5e5',
                      border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                      whiteSpace: 'pre-wrap',
                      fontWeight: msg.role === 'user' ? 500 : 400,
                    }}
                  >
                    {msg.content}

                    {/* Render Tool Call Action Card if available */}
                    {msg.toolCall && (
                      <div
                        style={{
                          marginTop: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>
                          <Sparkles size={14} />
                          {msg.toolCall.displayText}
                        </div>
                        <button
                          onClick={() => executeToolCall(msg.toolCall!)}
                          style={{
                            padding: '5px 12px',
                            fontSize: '0.72rem',
                            borderRadius: '9999px',
                            background: '#ffffff',
                            color: '#000000',
                            border: 'none',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
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
                      color: '#737373',
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
                      background: 'rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <UserIcon size={14} color="#ffffff" />
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
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={15} color="#000000" />
                </div>
                <div
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#a3a3a3',
                  }}
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
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#0d0d0d',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Ask anything or request actions..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                opacity: isLoading || !input.trim() ? 0.4 : 1,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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

