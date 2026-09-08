'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, 
  Send, 
  Smile, 
  Pin, 
  Search, 
  Lock, 
  Code, 
  Trash2, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Shield, 
  Volume2, 
  Plus,
  Edit
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { CommunityChannel, CommunityMessage, User } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { BuyCreditsModal } from '@/components/credits/BuyCreditsModal';
import { ReferralModal } from '@/components/referral/ReferralModal';

export default function CommunityPage() {
  const { currentUser, isAdmin, wallet, deductCredits } = useAuth();
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [activeChannelSlug, setActiveChannelSlug] = useState('general');
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [codeSnippetOpen, setCodeSnippetOpen] = useState(false);
  const [snippetCode, setSnippetCode] = useState('');
  const [snippetLang, setSnippetLang] = useState('typescript');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineMembers, setOnlineMembers] = useState<User[]>([]);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setChannels(dbStore.getChannels());
    setOnlineMembers(dbStore.getUsers());
    loadMessages('general');
  }, []);

  const loadMessages = (slug: string) => {
    setActiveChannelSlug(slug);
    const msgs = dbStore.getMessages(slug);
    setMessages([...msgs]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleChannelSwitch = (slug: string) => {
    soundEffects.playClick();
    loadMessages(slug);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !snippetCode.trim()) return;
    if (!currentUser) return;

    if (!isAdmin && (wallet?.totalCredits ?? 0) < 1) {
      setShowBuyCredits(true);
      return;
    }

    if (!isAdmin) {
      const ok = deductCredits(1, `Community chat message in #${activeChannelSlug}`);
      if (!ok) {
        setShowBuyCredits(true);
        return;
      }
    }

    let finalContent = inputText.trim();
    if (snippetCode.trim()) {
      const codeBlock = `\`\`\`${snippetLang}\n${snippetCode.trim()}\n\`\`\``;
      finalContent = finalContent ? `${finalContent}\n\n${codeBlock}` : codeBlock;
    }

    const newMsg = dbStore.addMessage({
      channelSlug: activeChannelSlug,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: finalContent,
    });

    soundEffects.playSuccess();
    setInputText('');
    setSnippetCode('');
    setCodeSnippetOpen(false);
    setMessages([...messages, newMsg]);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    soundEffects.playClick();
    dbStore.toggleReaction(messageId, emoji, currentUser.id);
    const updated = dbStore.getMessages(activeChannelSlug);
    setMessages([...updated]);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!isAdmin || !currentUser) return;
    if (confirm('Delete this message as administrator?')) {
      try {
        await api.community.deleteMessage(messageId);
      } catch (_) {}
      dbStore.deleteMessage(messageId, currentUser);
      soundEffects.playClick();
      setMessages(messages.filter(m => m.id !== messageId));
    }
  };

  const handleStartEditMessage = (msg: CommunityMessage) => {
    setEditingMessageId(msg.id);
    setEditContent(msg.content);
  };

  const handleSaveEditMessage = async (messageId: string) => {
    if (!editContent.trim() || !currentUser || !isAdmin) return;
    soundEffects.playSuccess();
    try {
      await api.community.editMessage(messageId, editContent.trim());
    } catch (_) {}
    dbStore.editMessageContent(messageId, editContent.trim(), currentUser);
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: editContent.trim() } : m));
    setEditingMessageId(null);
  };

  const currentChannel = channels.find(c => c.slug === activeChannelSlug) || channels[0];
  const filteredMessages = searchQuery
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 70px)',
        background: 'var(--bg-base)',
        overflow: 'hidden',
      }}
    >
      {/* Channels Sidebar */}
      <div
        className="hide-on-mobile"
        style={{
          width: '260px',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Nirvana Hub
            </span>
          </div>
          <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
            12 Rooms
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 8px', letterSpacing: '0.5px' }}>
            Discussion Channels
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {channels.map((ch) => {
              const active = ch.slug === activeChannelSlug;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleChannelSwitch(ch.slug)}
                  className="btn-ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <Hash size={15} style={{ color: active ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ch.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Card Footer */}
        {currentUser && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {isAdmin ? '🛡️ Admin' : `${wallet?.totalCredits ?? 0} Credits`}
                </div>
              </div>
            </div>
            {!isAdmin && (
              <button
                onClick={() => setShowBuyCredits(true)}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                title="Get more credits"
              >
                + Credits
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Hash size={20} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentChannel?.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {currentChannel?.description}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.78rem',
                  color: 'var(--text-primary)',
                  width: '120px',
                }}
              />
            </div>

            <div className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
              ● {onlineMembers.length} Active
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <MessageSquare size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No messages in #{currentChannel?.name} yet.</p>
              <p style={{ fontSize: '0.78rem' }}>Be the first to say hello or start a technical discussion!</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isLeadAdmin = msg.userRole === 'ADMIN';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background 0.15s ease',
                  }}
                  className="chat-message-row"
                >
                  <img
                    src={msg.userAvatar}
                    alt={msg.userName}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isLeadAdmin ? '2px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {msg.userName}
                      </span>
                      {isLeadAdmin && (
                        <span className="badge badge-rose" style={{ fontSize: '0.64rem', padding: '1px 6px' }}>
                          🛡️ Admin
                        </span>
                      )}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleStartEditMessage(msg)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Modify message content"
                          >
                            <Edit size={13} style={{ color: 'var(--accent-cyan)' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Delete message"
                          >
                            <Trash2 size={13} style={{ color: 'var(--accent-rose)' }} />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingMessageId === msg.id ? (
                      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="input-custom"
                          style={{ width: '100%', minHeight: '60px', fontSize: '0.86rem', resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <button
                            onClick={() => handleSaveEditMessage(msg.id)}
                            className="btn-primary"
                            style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '4px' }}
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingMessageId(null)}
                            className="btn-ghost"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {msg.content}
                      </div>
                    )}

                    {/* Emoji Reactions */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                      {['🔥', '🚀', '💻', '❤️'].map((emoji) => {
                        const users = msg.reactions?.[emoji] || [];
                        const hasReacted = currentUser ? users.includes(currentUser.id) : false;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-full)',
                              background: hasReacted ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                              border: hasReacted ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                            }}
                          >
                            <span>{emoji}</span>
                            {users.length > 0 && <span style={{ fontWeight: 700 }}>{users.length}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-glass-card)',
          }}
        >
          {/* Optional Code Snippet Expansion */}
          {codeSnippetOpen && (
            <div
              style={{
                marginBottom: '10px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-glow)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  Paste Code Snippet
                </span>
                <select
                  value={snippetLang}
                  onChange={(e) => setSnippetLang(e.target.value)}
                  style={{
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                  }}
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="sql">SQL</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <textarea
                placeholder="// Enter code snippet here..."
                value={snippetCode}
                onChange={(e) => setSnippetCode(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  padding: '8px',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setCodeSnippetOpen(!codeSnippetOpen);
              }}
              className="btn btn-secondary"
              style={{ padding: '8px', borderRadius: '10px' }}
              title="Attach code snippet"
            >
              <Code size={16} style={{ color: codeSnippetOpen ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
            </button>

            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-glow)',
              }}
            >
              <input
                type="text"
                placeholder={`Message #${currentChannel?.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.88rem',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() && !snippetCode.trim()}
              className="btn btn-primary"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '9px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Send</span>
              <Send size={14} />
            </button>
          </form>
          <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>⚡ 1 message = 1 community token</span>
            <span>Tip: Click &lt;/&gt; to format and share formatted code snippets</span>
          </div>
        </div>
      </div>

      {/* Online Users List Sidebar */}
      <div
        className="hide-on-mobile"
        style={{
          width: '220px',
          borderLeft: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Members Online ({onlineMembers.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {onlineMembers.map((user) => (
            <div
              key={user.id}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '1px solid var(--bg-surface)',
                  }}
                />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.role === 'ADMIN' ? 'Moderator' : user.level}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BuyCreditsModal
        isOpen={showBuyCredits}
        onClose={() => setShowBuyCredits(false)}
        onOpenReferral={() => setShowReferral(true)}
      />
      <ReferralModal
        isOpen={showReferral}
        onClose={() => setShowReferral(false)}
      />
    </div>
  );
}