'use client';

import React, { useState } from 'react';
import { X, Loader2, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

export function GoogleOAuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [language, setLanguage] = useState('English (United Kingdom)');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  if (!isOpen) return null;

  const handleOfficialGoogleSignIn = async () => {
    soundEffects.playClick();
    setIsSigningIn(true);
    try {
      const res = await signInWithGoogle();
      if (res?.error) {
        console.error('Official Google sign-in error:', res.error);
      }
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSigningIn(false);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      {/* Outer Dialog Box */}
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Google Dark Card */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#131314',
            borderRadius: '28px',
            border: '1px solid #303134',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 1px rgba(255, 255, 255, 0.1)',
            color: '#e3e3e3',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          {/* Top Google Header Bar */}
          <div
            style={{
              padding: '18px 28px 14px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#f1f3f4', letterSpacing: '0.1px' }}>
                Sign in with Google
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9aa0a6',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9aa0a6';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Indeterminate Google Loading Bar */}
          {isSigningIn && (
            <div
              style={{
                height: '3px',
                width: '100%',
                background: 'rgba(66, 133, 244, 0.2)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  height: '100%',
                  background: '#8ab4f8',
                  animation: 'googleIndeterminate 1.4s infinite ease-in-out',
                }}
              />
            </div>
          )}

          {/* Card Body */}
          <div
            style={{
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* App Brand Logo */}
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: '#0a0d14',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)',
                padding: '6px',
              }}
            >
              <img
                src="/assets/tygn-logo.png"
                alt="TYGN Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <h1
              style={{
                fontSize: '28px',
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                margin: '0 0 8px 0',
              }}
            >
              Sign in with Google
            </h1>

            <p
              style={{
                fontSize: '15px',
                color: '#c4c7c5',
                lineHeight: 1.5,
                maxWidth: '400px',
                margin: '0 0 32px 0',
              }}
            >
              to continue to <strong style={{ color: '#ffffff', fontWeight: 600 }}>Techyogeek Nirvana</strong>
            </p>

            {/* Official Google Button */}
            <button
              type="button"
              onClick={handleOfficialGoogleSignIn}
              disabled={isSigningIn}
              style={{
                width: '100%',
                maxWidth: '380px',
                padding: '14px 24px',
                borderRadius: '28px',
                backgroundColor: '#1a73e8',
                color: '#ffffff',
                border: 'none',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isSigningIn ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(26, 115, 232, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1557b0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a73e8';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isSigningIn ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            {/* Privacy Disclaimer */}
            <div
              style={{
                marginTop: '28px',
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#9aa0a6',
                maxWidth: '420px',
              }}
            >
              Google will share your name, email address, language preference, and profile picture with Techyogeek Nirvana.
            </div>
          </div>
        </div>

        {/* Bottom Outside Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 12px',
            fontSize: '12px',
            color: '#9aa0a6',
          }}
        >
          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9aa0a6',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 0',
              }}
            >
              <span>{language}</span>
              <ChevronDown size={14} />
            </button>

            {showLanguageDropdown && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '26px',
                  left: 0,
                  backgroundColor: '#202124',
                  border: '1px solid #3c4043',
                  borderRadius: '8px',
                  padding: '6px 0',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                  zIndex: 20,
                  minWidth: '180px',
                }}
              >
                {['English (United Kingdom)', 'English (United States)', 'Hindi (हिन्दी)'].map((lang) => (
                  <div
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                    style={{
                      padding: '8px 14px',
                      color: language === lang ? '#8ab4f8' : '#e8eaed',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>{lang}</span>
                    {language === lang && <Check size={14} style={{ color: '#8ab4f8' }} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legal Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>Help</span>
            <span style={{ cursor: 'pointer' }}>Privacy</span>
            <span style={{ cursor: 'pointer' }}>Terms</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes googleIndeterminate {
          0% {
            left: -35%;
            right: 100%;
          }
          60% {
            left: 100%;
            right: -90%;
          }
          100% {
            left: 100%;
            right: -90%;
          }
        }
      `}</style>
    </div>
  );
}
