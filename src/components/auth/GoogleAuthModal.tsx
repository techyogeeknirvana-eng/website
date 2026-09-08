'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Lock, Mail, Eye, EyeOff, User as UserIcon, Shield, Activity, ArrowRight, Gift, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
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
  );
}

export function GoogleAuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { loginWithPassword, signUpWithPassword, loginWithGoogle, verifyEmailOtp, resendVerificationOtp, openGoogleChooser, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const pending = sessionStorage.getItem('tygn_pending_referral') || localStorage.getItem('tygn_pending_referral') || '';
      if (pending) setReferralCodeInput(pending);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (mode === 'verify') {
      if (!otpCode.trim() || otpCode.trim().length !== 6) {
        setErrorMsg('Please enter the 6-digit verification code.');
        return;
      }
      setIsLoading(true);
      soundEffects.playClick();
      try {
        const res = await verifyEmailOtp(email.trim(), otpCode.trim());
        if (!res.success) {
          setErrorMsg(res.error || 'Verification failed. Please check the code.');
        } else {
          onClose();
        }
      } catch {
        setErrorMsg('Verification failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / Email address.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    soundEffects.playClick();

    try {
      if (mode === 'signin') {
        const res = await loginWithPassword(email.trim(), password.trim());
        if (!res.success) {
          setErrorMsg(res.error || 'Login failed. Please check credentials.');
        } else {
          onClose();
        }
      } else {
        if (referralCodeInput.trim() && typeof window !== 'undefined') {
          const cleanRef = referralCodeInput.trim().toUpperCase();
          sessionStorage.setItem('tygn_pending_referral', cleanRef);
          localStorage.setItem('tygn_pending_referral', cleanRef);
          document.cookie = `tygn_pending_referral=${cleanRef}; path=/; max-age=2592000; SameSite=Lax`;
        }
        const res = await signUpWithPassword(email.trim(), password.trim(), fullName.trim());
        if (!res.success) {
          setErrorMsg(res.error || 'Sign up failed. Please try again.');
        } else if (res.requiresVerification) {
          setMode('verify');
          if (res.otp) {
            setDemoOtp(res.otp);
          }
          setInfoMsg(`A 6-digit verification code was sent for ${email.trim()}.`);
        } else {
          onClose();
        }
      }
    } catch {
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    soundEffects.playClick();
    const res = await resendVerificationOtp(email.trim());
    if (res.success && res.otp) {
      setDemoOtp(res.otp);
      setInfoMsg(`New verification code sent!`);
    }
  };

  const handleQuickGoogleOAuth = () => {
    setErrorMsg('');
    setInfoMsg('');
    if (referralCodeInput.trim() && typeof window !== 'undefined') {
      const cleanRef = referralCodeInput.trim().toUpperCase();
      sessionStorage.setItem('tygn_pending_referral', cleanRef);
      localStorage.setItem('tygn_pending_referral', cleanRef);
      document.cookie = `tygn_pending_referral=${cleanRef}; path=/; max-age=2592000; SameSite=Lax`;
    }
    soundEffects.playClick();
    onClose();
    signInWithGoogle();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(5, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: '24px',
          padding: '32px 28px',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          textAlign: 'center',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(21, 21, 40, 0.95) 0%, rgba(14, 14, 27, 0.95) 100%)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(34, 211, 238, 0.25)',
          color: '#f8fafc',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <X size={16} />
        </button>

        {/* Glowing Brand Icon */}
        <div
          style={{
            position: 'relative',
            width: '74px',
            height: '74px',
            margin: '0 auto 16px auto',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.35), rgba(99, 102, 241, 0.35))',
              filter: 'blur(12px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/tygn-logo.png"
              alt="TYGN logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.7))',
              }}
            />
          </div>
        </div>

        {/* Network Access Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}
        >
          <Sparkles size={13} style={{ color: '#38bdf8' }} />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(56, 189, 248, 0.9)',
            }}
          >
            TYGN Network Access
          </span>
        </div>

        <h2
          className="text-gradient-premium"
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
          }}
        >
          {mode === 'verify' ? 'Verify Your Email' : 'Enter the Network'}
        </h2>

        <p
          style={{
            fontSize: '0.86rem',
            color: 'rgba(203, 213, 225, 0.75)',
            margin: '0 auto 20px auto',
            maxWidth: '320px',
            lineHeight: 1.4,
          }}
        >
          {mode === 'verify'
            ? `Enter the 6-digit verification code sent to ${email}`
            : mode === 'signin'
            ? 'Enter your Gmail & password to sign in.'
            : 'Create your account with your Gmail & password.'}
        </p>

        {/* Mode Selector Tabs */}
        {mode !== 'verify' && (
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '3px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setInfoMsg('');
              }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'signin' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                color: mode === 'signin' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setInfoMsg('');
              }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'signup' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                color: mode === 'signup' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div
            style={{
              background: errorMsg.toLowerCase().includes('banned') || errorMsg.toLowerCase().includes('suspended')
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(239, 68, 68, 0.15)',
              border: errorMsg.toLowerCase().includes('banned') || errorMsg.toLowerCase().includes('suspended')
                ? '1.5px solid rgba(239, 68, 68, 0.85)'
                : '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#fecaca',
              fontSize: '0.82rem',
              marginBottom: '16px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              boxShadow: errorMsg.toLowerCase().includes('banned') || errorMsg.toLowerCase().includes('suspended')
                ? '0 0 25px rgba(239, 68, 68, 0.35)'
                : 'none',
            }}
          >
            <ShieldAlert size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ lineHeight: 1.45, fontWeight: errorMsg.toLowerCase().includes('banned') ? 600 : 400 }}>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Info Notification */}
        {infoMsg && (
          <div
            style={{
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '10px',
              padding: '8px 12px',
              color: '#67e8f9',
              fontSize: '0.8rem',
              marginBottom: '16px',
              textAlign: 'left',
            }}
          >
            {infoMsg}
          </div>
        )}

        {/* Direct Email & Password / OTP Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {mode === 'verify' ? (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  6-Digit Verification Code
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '0 12px',
                  }}
                >
                  <Lock size={16} style={{ color: '#94a3b8', marginRight: '8px' }} />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 0',
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '1.1rem',
                      letterSpacing: '4px',
                      fontWeight: 700,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {demoOtp && (
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    color: '#a5b4fc',
                    marginBottom: '16px',
                  }}
                >
                  💡 <strong>Sandbox code:</strong> Use <code>{demoOtp}</code> to verify immediately.
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-premium"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)',
                }}
              >
                {isLoading ? 'Verifying...' : 'Verify & Enter Platform'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
          {mode === 'signup' && (
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  marginBottom: '6px',
                }}
              >
                Full Name
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0 12px',
                }}
              >
                <UserIcon size={16} style={{ color: '#94a3b8', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="e.g. Ishpreet Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '6px',
              }}
            >
              Gmail / Email Address
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '0 12px',
              }}
            >
              <Mail size={16} style={{ color: '#94a3b8', marginRight: '8px' }} />
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 0',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>
            {email.trim().toLowerCase() === 'techyogeeknirvana@gmail.com' && (
              <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#f87171', fontWeight: 600 }}>
                🛡️ Recognized as Lead Administrator Account
              </div>
            )}
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '0 12px',
              }}
            >
              <Lock size={16} style={{ color: '#94a3b8', marginRight: '8px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 0',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Optional Referral Code in Signup Mode */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#cbd5e1',
                  }}
                >
                  Referral / Invite Code (Optional)
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>+10 Welcome Credits</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0 12px',
                }}
              >
                <Gift size={16} style={{ color: 'var(--accent-cyan)', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="e.g. TYGN-ADMIN-LEAD"
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-premium"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '0.94rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)',
            }}
          >
            {isLoading ? (
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: '#ffffff',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
            </>
          )}
        </form>

        {/* Divider & Google 1-Click OAuth (only when not in verify mode) */}
        {mode !== 'verify' && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '20px 0 16px 0',
                color: 'rgba(255, 255, 255, 0.25)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <span>or 1-click oauth</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            <button
              type="button"
              onClick={handleQuickGoogleOAuth}
              disabled={isLoading}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
              }}
            >
              <GoogleIcon size={18} />
              <span>Continue with Google</span>
            </button>
          </>
        )}

        {/* 3 Badges */}
        <div
          style={{
            marginTop: '22px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            fontSize: '9.5px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 4px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <Lock size={13} style={{ color: '#38bdf8' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Encrypted</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 4px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <Activity size={13} style={{ color: '#38bdf8' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Real-time</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 4px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <Sparkles size={13} style={{ color: '#38bdf8' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Student-first</span>
          </div>
        </div>

        <p
          style={{
            marginTop: '16px',
            fontSize: '9.5px',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'rgba(148, 163, 184, 0.55)',
            marginBottom: 0,
          }}
        >
          256-Bit Encrypted · Secure Session
        </p>
      </div>
    </div>
  );
}
