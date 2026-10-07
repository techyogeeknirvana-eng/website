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
  Edit,
  Paperclip,
  FileText,
  Download,
  AlertTriangle,
  Reply,
  CheckCircle2,
  X,
  UserCheck
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { CommunityChannel, CommunityMessage, MessageAttachment, User } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { BuyCreditsModal } from '@/components/credits/BuyCreditsModal';
import { ReferralModal } from '@/components/referral/ReferralModal';

const CATEGORY_SECTIONS = [
  { title: 'COMMUNITY GENERAL', slugs: ['general', 'introductions'] },
  { title: 'TECH & ENGINEERING', slugs: ['web-development', 'ai-ml', 'cybersecurity', 'cloud', 'competitive-programming', 'open-source'] },
  { title: 'COLLEGE & CAREER', slugs: ['career', 'startups', 'college-community'] },
  { title: 'EVENTS & STAGES', slugs: ['projects'] },
];

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
  
  // Edit & Reply State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<CommunityMessage | null>(null);

  // Attachments State
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Report Modal State
  const [reportingMessage, setReportingMessage] = useState<CommunityMessage | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const activeSlugRef = useRef(activeChannelSlug);
  activeSlugRef.current = activeChannelSlug;

  const fetchServerMessages = async (slug: string, autoScroll = false) => {
    try {
      const res = await fetch(`/api/community?channel=${encodeURIComponent(slug)}&limit=100`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.messages) {
          const serverMsgs: CommunityMessage[] = json.data.messages;
          dbStore.mergeMessages(serverMsgs);
          if (activeSlugRef.current === slug) {
            setMessages(prev => {
              const map = new Map<string, CommunityMessage>();
              prev.forEach(m => map.set(m.id, m));
              serverMsgs.forEach(m => map.set(m.id, m));
              return Array.from(map.values());
            });
            if (autoScroll) {
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }
          }
        }
      }
    } catch (_) {}
  };

  const loadMessages = (slug: string) => {
    setActiveChannelSlug(slug);
    activeSlugRef.current = slug;
    setReplyingToMessage(null);
    const msgs = dbStore.getMessages(slug);
    setMessages([...msgs]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    fetchServerMessages(slug, true);
  };

  useEffect(() => {
    setChannels(dbStore.getChannels());
    setOnlineMembers(dbStore.getUsers());
    loadMessages('general');

    const interval = setInterval(() => {
      fetchServerMessages(activeSlugRef.current, false);
    }, 2500);

    const onFocus = () => {
      fetchServerMessages(activeSlugRef.current, false);
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const handleChannelSwitch = (slug: string) => {
    soundEffects.playClick();
    loadMessages(slug);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds the 8MB community upload limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newAttachment: MessageAttachment = {
        id: 'att_' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: dataUrl,
      };
      setAttachments(prev => [...prev, newAttachment]);
      soundEffects.playSuccess();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    soundEffects.playClick();
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !snippetCode.trim() && attachments.length === 0) return;
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
      content: finalContent || (attachments.length > 0 ? `Shared ${attachments.length} attachment(s)` : ''),
      attachments: attachments.length > 0 ? attachments : undefined,
      replyToId: replyingToMessage?.id || undefined,
    });

    soundEffects.playSuccess();
    setInputText('');
    setSnippetCode('');
    setCodeSnippetOpen(false);
    setAttachments([]);
    setReplyingToMessage(null);
    setMessages(prev => [...prev, newMsg]);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    setTimeout(() => {
      fetchServerMessages(activeChannelSlug, false);
    }, 400);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    soundEffects.playClick();
    dbStore.toggleReaction(messageId, emoji, currentUser.id);
    const updated = dbStore.getMessages(activeChannelSlug);
    setMessages([...updated]);
    setTimeout(() => fetchServerMessages(activeChannelSlug, false), 400);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentUser) return;
    const msg = messages.find(m => m.id === messageId);
    const isOwn = msg && msg.userId === currentUser.id;
    const isStaff = isAdmin || currentUser.role === 'MODERATOR';
    if (!isOwn && !isStaff) return;

    if (confirm(isOwn ? 'Delete your message permanently?' : 'Delete this message as community staff?')) {
      try {
        await api.community.deleteMessage(messageId);
      } catch (_) {}
      dbStore.deleteMessage(messageId, currentUser);
      soundEffects.playClick();
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };

  const handleStartEditMessage = (msg: CommunityMessage) => {
    setEditingMessageId(msg.id);
    setEditContent(msg.content);
  };

  const handleSaveEditMessage = async (messageId: string) => {
    if (!editContent.trim() || !currentUser) return;
    const msg = messages.find(m => m.id === messageId);
    const isOwn = msg && msg.userId === currentUser.id;
    const isStaff = isAdmin || currentUser.role === 'MODERATOR';
    if (!isOwn && !isStaff) return;

    soundEffects.playSuccess();
    try {
      await api.community.editMessage(messageId, editContent.trim());
    } catch (_) {}
    dbStore.editMessageContent(messageId, editContent.trim(), currentUser);
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: editContent.trim() } : m));
    setEditingMessageId(null);
  };

  const handleOpenReport = (msg: CommunityMessage) => {
    soundEffects.playClick();
    setReportingMessage(msg);
    setReportReason('Inappropriate Content');
    setReportDetails('');
    setReportSuccess(false);
  };

  const handleSubmitReport = async () => {
    if (!reportingMessage || !currentUser) return;
    soundEffects.playSuccess();

    const rep = dbStore.submitReport({
      reportedBy: currentUser.id,
      reportedByName: currentUser.name,
      targetType: 'message',
      targetId: reportingMessage.id,
      targetTitle: `Message in #${reportingMessage.channelSlug}: "${reportingMessage.content.slice(0, 50)}"`,
      reason: reportReason,
      details: reportDetails ? `${reportReason}: ${reportDetails}` : reportReason,
    }, currentUser);

    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_report', report: rep }),
      });
    } catch (_) {}

    setReportSuccess(true);
    setTimeout(() => {
      setReportingMessage(null);
      setReportSuccess(false);
    }, 1500);
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
        background: '#09090b',
        color: '#f4f4f5',
        overflow: 'hidden',
      }}
    >
      {/* Channels Sidebar: Discord-like categorized layout */}
      <div
        className="hide-on-mobile"
        style={{
          width: '270px',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#0d0d11',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Hub Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} className="text-white" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
              Nirvana Channels
            </span>
          </div>
          <span className="mono-badge text-[0.65rem] py-0.5 px-2 bg-white/10 text-white font-mono">
            DISCORD-STYLE
          </span>
        </div>

        {/* Categorized Channel List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {CATEGORY_SECTIONS.map((sec, secIdx) => {
            const secChannels = channels.filter(c => sec.slugs.includes(c.slug));
            if (secChannels.length === 0) return null;

            return (
              <div key={secIdx}>
                <div 
                  style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 800, 
                    color: '#71717a', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.06em', 
                    padding: '4px 8px',
                    fontFamily: 'monospace'
                  }}
                >
                  {sec.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                  {secChannels.map((ch) => {
                    const active = ch.slug === activeChannelSlug;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => handleChannelSwitch(ch.slug)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          fontSize: '0.84rem',
                          fontWeight: active ? 700 : 500,
                          color: active ? '#ffffff' : '#a1a1aa',
                          backgroundColor: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                          border: active ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          width: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Hash size={14} style={{ color: active ? '#ffffff' : '#71717a' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ch.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* User Card Footer */}
        {currentUser && (
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#09090b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#a1a1aa', fontFamily: 'monospace' }}>
                  {isAdmin ? '🛡️ Admin' : currentUser.role === 'MODERATOR' ? '⚔️ Moderator' : `${wallet?.totalCredits ?? 0} Credits`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#09090b' }}>
        {/* Channel Header Bar */}
        <div
          style={{
            height: '60px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0d0d11',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Hash size={20} className="text-white" />
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                {currentChannel?.name}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#a1a1aa', marginLeft: '12px' }} className="hide-on-mobile">
                {currentChannel?.description}
              </span>
            </div>
          </div>

          {/* Quick Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '5px 10px',
            }}
          >
            <Search size={14} style={{ color: '#71717a' }} />
            <input
              type="text"
              placeholder="Search in channel..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                width: '140px',
              }}
            />
          </div>
        </div>

        {/* Message Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {filteredMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#71717a' }}>
              <Hash size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Welcome to #{currentChannel?.name}!
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                This is the start of the #{currentChannel?.name} channel. Be the first to start the discussion!
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isOwn = currentUser && currentUser.id === msg.userId;
              const isStaff = isAdmin || currentUser?.role === 'MODERATOR';
              const canEdit = isOwn || isStaff;
              const canDelete = isOwn || isStaff;

              return (
                <div
                  key={msg.id}
                  className="group"
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    transition: 'background 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <img
                    src={msg.userAvatar}
                    alt={msg.userName}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)' }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Quoted Reply Banner */}
                    {msg.replyToId && (
                      <div style={{ fontSize: '0.72rem', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Reply size={11} />
                        <span>Replying to previous discussion...</span>
                      </div>
                    )}

                    {/* Author & Timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                          {msg.userName}
                        </span>
                        {msg.userRole === 'ADMIN' && (
                          <span className="mono-badge text-[0.62rem] py-0.5 px-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            ADMIN
                          </span>
                        )}
                        {msg.userRole === 'MODERATOR' && (
                          <span className="mono-badge text-[0.62rem] py-0.5 px-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            MOD
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#71717a', fontFamily: 'monospace' }}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Message Floating Actions */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', opacity: 0.85 }}>
                        <button
                          onClick={() => setReplyingToMessage(msg)}
                          className="btn-ghost"
                          style={{ padding: '3px 6px', fontSize: '0.72rem', color: '#a1a1aa' }}
                          title="Reply to message"
                        >
                          <Reply size={12} />
                        </button>

                        {!isOwn && currentUser && (
                          <button
                            onClick={() => handleOpenReport(msg)}
                            className="btn-ghost"
                            style={{ padding: '3px 6px', fontSize: '0.72rem', color: '#a1a1aa' }}
                            title="Report inappropriate message"
                          >
                            <AlertTriangle size={12} />
                          </button>
                        )}

                        {canEdit && (
                          <button
                            onClick={() => handleStartEditMessage(msg)}
                            className="btn-ghost"
                            style={{ padding: '3px 6px', fontSize: '0.72rem', color: '#a1a1aa' }}
                            title="Edit message"
                          >
                            <Edit size={12} />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="btn-ghost"
                            style={{ padding: '3px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                            title="Delete message"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content or Edit Box */}
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
                            className="btn-primary text-xs py-1 px-3 rounded"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingMessageId(null)}
                            className="btn-ghost text-xs py-1 px-3 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: '0.88rem',
                          color: '#e4e4e7',
                          lineHeight: 1.55,
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {msg.content}
                      </div>
                    )}

                    {/* Attachments Display */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        {msg.attachments.map(att => {
                          const isImg = att.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(att.name);
                          if (isImg) {
                            return (
                              <div key={att.id} style={{ maxWidth: '380px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', cursor: 'pointer' }}
                                  onClick={() => window.open(att.url, '_blank')}
                                />
                              </div>
                            );
                          }
                          return (
                            <a
                              key={att.id}
                              href={att.url}
                              download={att.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '8px',
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                width: 'fit-content',
                              }}
                            >
                              <FileText size={16} className="text-white" />
                              <div>
                                <div style={{ fontWeight: 600 }}>{att.name}</div>
                                <div style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>{(att.size / 1024).toFixed(1)} KB</div>
                              </div>
                              <Download size={13} style={{ marginLeft: '4px', opacity: 0.7 }} />
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Emoji Reactions */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', alignItems: 'center' }}>
                      {['🔥', '🚀', '💻', '❤️', '👀'].map((emoji) => {
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
                              padding: '2px 7px',
                              borderRadius: '999px',
                              background: hasReacted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                              border: hasReacted ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                            }}
                          >
                            <span>{emoji}</span>
                            {users.length > 0 && <span style={{ fontWeight: 700, color: '#fff' }}>{users.length}</span>}
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

        {/* Input Composer Area */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: '#0d0d11',
          }}
        >
          {/* Replying Banner */}
          {replyingToMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                marginBottom: '10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '0.78rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Reply size={13} />
                <span>Replying to <strong>{replyingToMessage.userName}</strong>: {replyingToMessage.content.slice(0, 45)}...</span>
              </div>
              <button onClick={() => setReplyingToMessage(null)} className="btn-ghost" style={{ padding: '2px 6px' }}>
                <X size={13} />
              </button>
            </div>
          )}

          {/* Attachments Preview Queue */}
          {attachments.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {attachments.map(att => (
                <div
                  key={att.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.75rem',
                  }}
                >
                  <FileText size={13} />
                  <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {att.name}
                  </span>
                  <button onClick={() => removeAttachment(att.id)} className="btn-ghost" style={{ padding: '0 2px' }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Optional Code Snippet Expansion */}
          {codeSnippetOpen && (
            <div
              style={{
                marginBottom: '10px',
                padding: '12px',
                borderRadius: '8px',
                background: '#000',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                  Paste Code Snippet
                </span>
                <select
                  value={snippetLang}
                  onChange={(e) => setSnippetLang(e.target.value)}
                  style={{
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
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
                  background: '#09090b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#e4e4e7',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  padding: '8px',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Attachment Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept="image/*,.pdf,.doc,.docx,.zip,.txt"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
              style={{ padding: '8px 10px', borderRadius: '8px' }}
              title="Attach File (Images, PDF, ZIP)"
            >
              <Paperclip size={16} />
            </button>

            {/* Code Snippet Button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setCodeSnippetOpen(!codeSnippetOpen);
              }}
              className="btn btn-secondary"
              style={{ padding: '8px 10px', borderRadius: '8px' }}
              title="Attach Code Snippet"
            >
              <Code size={16} />
            </button>

            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.15)',
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
                  color: '#fff',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() && !snippetCode.trim() && attachments.length === 0}
              className="btn btn-primary"
              style={{
                borderRadius: '8px',
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
          <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#71717a', fontFamily: 'monospace' }}>
            <span>⚡ 1 message = 1 community credit</span>
            <span>Attachments: PDF, DOC, ZIP, Images (up to 8MB)</span>
          </div>
        </div>
      </div>

      {/* Online Users List Sidebar */}
      <div
        className="hide-on-mobile"
        style={{
          width: '230px',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#0d0d11',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'monospace' }}>
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
                    border: '1px solid #0d0d11',
                  }}
                />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#71717a', fontFamily: 'monospace' }}>
                  {user.role === 'ADMIN' ? '🛡️ Admin' : user.role === 'MODERATOR' ? '⚔️ Moderator' : user.level}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Report Modal */}
      {reportingMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setReportingMessage(null)}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              borderRadius: '16px',
              background: '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {reportSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                  Report Submitted
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#a1a1aa' }}>
                  Thank you for keeping TYGN Nirvana safe. Our moderators will review this content.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                      Report Message to Moderation
                    </h4>
                  </div>
                  <button onClick={() => setReportingMessage(null)} className="btn-ghost" style={{ padding: '4px' }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px', fontSize: '0.82rem', color: '#d4d4d8' }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{reportingMessage.userName}</div>
                  <div style={{ color: '#a1a1aa' }}>&quot;{reportingMessage.content.slice(0, 90)}&quot;</div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: '#e4e4e7' }}>
                    Violation Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="input-custom"
                    style={{ width: '100%', background: '#09090b', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                  >
                    <option value="Spam or Unsolicited Promotion">Spam or Unsolicited Promotion</option>
                    <option value="Harassment or Hate Speech">Harassment or Hate Speech</option>
                    <option value="Scam or Malicious Link">Scam or Malicious Link</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Rules & Guidelines Violation">Rules &amp; Guidelines Violation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: '#e4e4e7' }}>
                    Additional Context (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any details for the moderator team..."
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    className="input-custom"
                    style={{ width: '100%', background: '#09090b', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button onClick={() => setReportingMessage(null)} className="btn btn-secondary text-xs py-2 px-4 rounded-lg">
                    Cancel
                  </button>
                  <button onClick={handleSubmitReport} className="btn btn-danger text-xs py-2 px-4 rounded-lg">
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Credit Modals */}
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