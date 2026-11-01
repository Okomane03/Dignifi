import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Shield,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Building,
  UserCheck,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import {
  authenticateUser,
  registerUser,
  resetPassword,
  evaluatePasswordStrength,
  checkRateLimit,
  AuthSession,
} from '../utils/auth';
import { DignifiLogo } from './DignifiLogo';

interface LoginDashboardProps {
  onLoginSuccess: (session: AuthSession) => void;
}

export const LoginDashboard: React.FC<LoginDashboardProps> = ({ onLoginSuccess }) => {
  // Selected Workspace Role: Employee vs HR
  const [selectedRole, setSelectedRole] = useState<'employee' | 'hr'>('employee');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regRecoveryWord, setRegRecoveryWord] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotRecoveryWord, setForgotRecoveryWord] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotNewPasswordConfirm, setForgotNewPasswordConfirm] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  // Password Strength live evaluation
  const activePasswordForStrength = mode === 'register' ? regPassword : mode === 'forgot' ? forgotNewPassword : '';
  const passwordStrength = evaluatePasswordStrength(activePasswordForStrength);

  // Check rate limit timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      if (loginIdentifier.trim()) {
        const rate = checkRateLimit(loginIdentifier.trim());
        setLockoutSeconds(rate.remainingLockSeconds);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [loginIdentifier]);

  // Update identifier when switching roles if demo fields are clicked
  const fillDemoCredentials = () => {
    if (selectedRole === 'employee') {
      setLoginIdentifier('dignifi_user');
      setLoginPassword('DignifiedWorkplace2026!');
    } else {
      setLoginIdentifier('dignifi_hr');
      setLoginPassword('DignifiedWorkplace2026!');
    }
    setLoginError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim() || !loginPassword) {
      setLoginError('Please enter both your username/email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await authenticateUser({
      identifier: loginIdentifier,
      password: loginPassword,
      requiredRole: selectedRole,
    });
    setIsSubmitting(false);

    if (result.success && result.session) {
      onLoginSuccess(result.session);
    } else {
      setLoginError(result.error || 'Authentication failed.');
      if (result.isLocked) {
        setLockoutSeconds(result.remainingLockSeconds || 60);
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessMsg(null);

    setIsSubmitting(true);
    const result = await registerUser({
      username: regUsername,
      email: regEmail,
      password: regPassword,
      passwordConfirm: regPasswordConfirm,
      recoverySecretWord: regRecoveryWord,
      role: selectedRole,
    });
    setIsSubmitting(false);

    if (result.success) {
      setRegSuccessMsg('Account created successfully with PBKDF2 cryptographic hashing. You can now sign in.');
      setLoginIdentifier(regUsername);
      setLoginPassword('');
      setTimeout(() => {
        setMode('login');
      }, 1500);
    } else {
      setRegError(result.error || 'Registration failed.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccessMsg(null);

    setIsSubmitting(true);
    const result = await resetPassword({
      identifier: forgotIdentifier,
      recoverySecretWord: forgotRecoveryWord,
      newPassword: forgotNewPassword,
      newPasswordConfirm: forgotNewPasswordConfirm,
    });
    setIsSubmitting(false);

    if (result.success) {
      setForgotSuccessMsg('Password successfully reset. You may now log in with your new password.');
      setLoginIdentifier(forgotIdentifier);
      setLoginPassword('');
      setTimeout(() => {
        setMode('login');
      }, 1500);
    } else {
      setForgotError(result.error || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F3] flex items-center justify-center p-4 sm:p-8">
      {/* Container card mirroring the 2-column layout in image_76678573.png */}
      <div className="bg-white border border-[#DFE7DB] rounded-[32px] shadow-xl max-w-5xl w-full overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* LEFT COLUMN: AUTHENTICATION FORM */}
        <div className="lg:col-span-6 p-7 sm:p-12 flex flex-col justify-between">
          <div>
            
            {/* Top Brand Marker (without version number per prompt) */}
            <div className="mb-6">
              <DignifiLogo size="sm" />
            </div>

            {/* Role Selector: Employee vs HR Portal */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#546657] uppercase tracking-wider mb-2">
                Select Destination Portal:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#EEF2EB] rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('employee');
                    setLoginError(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'employee'
                      ? 'bg-white text-[#2D4335] shadow-xs'
                      : 'text-[#5C6E5E] hover:text-[#1C261E]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Employee Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('hr');
                    setLoginError(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'hr'
                      ? 'bg-white text-[#2D4335] shadow-xs'
                      : 'text-[#5C6E5E] hover:text-[#1C261E]'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>HR Portal</span>
                </button>
              </div>
            </div>

            {/* Header: "Welcome Back!" in bold, description below per exact prompt */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                {mode === 'login' ? 'Welcome Back!' : mode === 'register' ? 'Create Your Account' : 'Reset Your Password'}
              </h1>
              <p className="text-sm text-[#4B5563] mt-2 leading-relaxed">
                Your workplace experiences are personal. You remain in control of what you document and what you choose to share. Sign in or create an account
              </p>
            </div>

            {/* Rate Limit Locked Warning */}
            {lockoutSeconds > 0 && (
              <div className="mb-5 p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-center gap-3 text-xs text-[#991B1B]">
                <ShieldAlert className="w-5 h-5 shrink-0 text-[#DC2626]" />
                <div>
                  <p className="font-bold">Security Lockout Active</p>
                  <p>Too many repeated failed attempts. Please wait <span className="font-mono font-bold">{lockoutSeconds}s</span> before retrying.</p>
                </div>
              </div>
            )}

            {/* TAB: LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    {selectedRole === 'employee' ? 'Username or Email' : 'HR Officer ID or Corporate Email'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder={selectedRole === 'employee' ? 'e.g. your_name or email@domain.com' : 'e.g. hr.lead@organization.co.za'}
                      disabled={lockoutSeconds > 0}
                      className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2D4335]/30 focus:border-[#2D4335] disabled:opacity-50"
                    />
                    <User className="w-4 h-4 text-[#9CA3AF] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#374151]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-medium text-[#2D4335] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Enter your password (min 12 characters)"
                      disabled={lockoutSeconds > 0}
                      className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2D4335]/30 focus:border-[#2D4335] disabled:opacity-50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || lockoutSeconds > 0}
                  className="w-full py-3.5 bg-[#1C261E] hover:bg-[#111827] text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Authenticating...'
                      : selectedRole === 'employee'
                      ? 'Sign In to Employee Vault'
                      : 'Sign In to HR Portal'}
                  </span>
                </button>

                {/* Pre-filled Demo Login Helper for Testing */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-xs text-[#2D4335] hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#368579]" />
                    <span>
                      {selectedRole === 'employee'
                        ? 'Fill Employee Demo Credentials (dignifi_user)'
                        : 'Fill HR Specialist Demo Credentials (dignifi_hr)'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {regError && (
                  <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}
                {regSuccessMsg && (
                  <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl text-xs text-[#166534] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value)}
                      placeholder="e.g. employee_user"
                      className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Password <span className="text-xs font-normal text-[#6B7280]">(Minimum 12 chars, spaces allowed)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="e.g. Correct Horse Battery Staple 2026!"
                      className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827] pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {regPassword.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#6B7280]">Strength:</span>
                        <span className="font-semibold" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label} ({regPassword.length} characters)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden flex">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${(passwordStrength.score / 4) * 100}%`,
                            backgroundColor: passwordStrength.color
                          }}
                        />
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <p className="text-[10px] text-[#DC2626] leading-tight">
                          {passwordStrength.feedback[0]}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regPasswordConfirm}
                      onChange={e => setRegPasswordConfirm(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827] pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {regPasswordConfirm && regPassword !== regPasswordConfirm && (
                    <p className="text-[10px] text-[#DC2626] mt-0.5">Passwords do not match.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Recovery Secret Word <span className="text-xs font-normal text-[#6B7280]">(For password reset verification)</span>
                  </label>
                  <input
                    type="text"
                    value={regRecoveryWord}
                    onChange={e => setRegRecoveryWord(e.target.value)}
                    placeholder="e.g. childhood nickname or memorable phrase"
                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !passwordStrength.isValid || regPassword !== regPasswordConfirm}
                  className="w-full py-3 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Secure Account...' : `Register as ${selectedRole === 'hr' ? 'HR Staff' : 'Employee'}`}</span>
                </button>
              </form>
            )}

            {/* TAB: FORGOT PASSWORD FLOW */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                {forgotError && (
                  <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{forgotError}</span>
                  </div>
                )}
                {forgotSuccessMsg && (
                  <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl text-xs text-[#166534] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{forgotSuccessMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Your Username or Email
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={e => setForgotIdentifier(e.target.value)}
                    placeholder="Enter account identifier"
                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Recovery Secret Word
                  </label>
                  <input
                    type="text"
                    value={forgotRecoveryWord}
                    onChange={e => setForgotRecoveryWord(e.target.value)}
                    placeholder="The secret word set during registration"
                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    New Password (Min 12 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={e => setForgotNewPassword(e.target.value)}
                      placeholder="Enter new 12+ char password"
                      className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827] pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer"
                    >
                      {showForgotNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={forgotNewPasswordConfirm}
                    onChange={e => setForgotNewPasswordConfirm(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111827]"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="flex-1 py-2 text-xs font-semibold text-[#4B5563] bg-white border border-[#D1D5DB] hover:bg-[#F3F4F6] rounded-xl cursor-pointer"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !forgotNewPassword || forgotNewPassword !== forgotNewPasswordConfirm}
                    className="flex-1 py-2 bg-[#2D4335] hover:bg-[#203126] text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Bottom Switcher */}
          <div className="pt-5 border-t border-[#F3F4F6] mt-5 text-center text-xs text-[#6B7280]">
            {mode === 'login' ? (
              <p>
                Not registered yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#2D4335] hover:underline cursor-pointer ml-1"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#2D4335] hover:underline cursor-pointer ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BRAND SHOWCASE & SPEECH BUBBLE LOGO */}
        <div className="lg:col-span-6 bg-[#EDF3EA] border-t lg:border-t-0 lg:border-l border-[#DFE7DB] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#DEEAD9] rounded-full filter blur-2xl opacity-60 pointer-events-none" />

          {/* Top of right column: Dignifi Logo with Speech Bubble Dot on the last 'i' */}
          <div className="relative z-10">
            <DignifiLogo size="lg" showTagline={true} />
          </div>

          {/* Center Illustration: Embedded from user attachment */}
          <div className="my-6 relative z-10">
            <div className="rounded-2xl overflow-hidden border border-[#D5E1D1] shadow-sm bg-white">
              <img
                src="/assets/aistudio/image_a45c590a.png"
                alt="Dignifi - Stronger workplaces. Dignified people."
                className="w-full h-auto object-cover max-h-56"
              />
            </div>
          </div>

          {/* Bottom: Dignified quote & trust hallmarks */}
          <div className="relative z-10 pt-4 border-t border-[#D9E5D5] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2D4335]">
              <Shield className="w-4 h-4 text-[#368579]" />
              <span>{selectedRole === 'employee' ? 'Employee Privacy-First Vault' : 'Organisational Accountability & Prevention'}</span>
            </div>
            <p className="text-xs text-[#526354] leading-relaxed">
              {selectedRole === 'employee'
                ? 'Your workplace records remain in your private local vault until you explicitly choose to submit them. No telemetry or company keystroke tracking.'
                : 'Empowers Employee Relations teams to review reports, track human-centred interventions, and spot systemic patterns without compromising individual employee dignity.'}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-[#637565] font-medium pt-1">
              <span>&#128274; PBKDF2 Encrypted</span>
              <span>&middot;</span>
              <span>&#128683; Zero Corporate Tracking</span>
              <span>&middot;</span>
              <span>&#127487;&#127462; EEA 2022 Aligned</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
