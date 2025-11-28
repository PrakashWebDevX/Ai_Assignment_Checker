import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { Terminal, ShieldCheck, Loader, Phone, Mail, ArrowLeft } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const { user, loading, login, loginWithPhone, verifyOTP, loginWithEmail } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'main' | 'phone' | 'otp' | 'email' | 'email-signup'>('main');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-green-500 animate-spin" />
          <p className="text-green-400 font-mono">SYSTEM_BOOT...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/checker" />;
  }

  const handleLogin = async () => {
    setIsSigningIn(true);
    await login();
    setIsSigningIn(false);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      return;
    }
    await loginWithPhone(phoneNumber);
    setLoginMethod('otp');
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      return;
    }
    setIsVerifying(true);
    const success = await verifyOTP(otp);
    setIsVerifying(false);
    if (!success) {
      setOtp('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 border-t-4 border-t-green-500">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="w-16 h-16 mx-auto bg-green-900/20 rounded-sm border border-green-500/30 flex items-center justify-center">
              <Terminal className="w-8 h-8 text-green-500" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white font-heading mb-2">
                SYSTEM ACCESS
              </h1>
              <p className="text-green-100/50 font-mono text-sm">
                {loginMethod === 'main' && 'Choose authentication method'}
                {loginMethod === 'phone' && 'Enter your phone number'}
                {loginMethod === 'otp' && 'Verify with OTP'}
              </p>
            </div>

            {/* Main Menu */}
            {loginMethod === 'main' && (
              <div className="space-y-4 pt-4">
                <Button
                  onClick={handleLogin}
                  isLoading={isSigningIn}
                  className="w-full py-6 bg-green-600 text-white hover:bg-green-700 border border-green-500/50 hover:border-green-400 shadow-lg hover:shadow-green-500/50"
                  data-testid="button-quick-access"
                >
                  {isSigningIn ? 'INITIALIZING...' : 'QUICK ACCESS'}
                </Button>

                <Button
                  onClick={() => {
                    setLoginMethod('phone');
                    setPhoneNumber('');
                    setOtp('');
                  }}
                  className="w-full py-6 bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/50 hover:border-blue-400 shadow-lg hover:shadow-blue-500/50"
                  data-testid="button-phone-login"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  PHONE LOGIN
                </Button>

                <Button
                  onClick={() => {
                    setLoginMethod('email');
                    setEmail('');
                    setPassword('');
                  }}
                  className="w-full py-6 bg-purple-600 text-white hover:bg-purple-700 border border-purple-500/50 hover:border-purple-400 shadow-lg hover:shadow-purple-500/50"
                  data-testid="button-email-login"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  EMAIL LOGIN
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-500 font-mono">
                      Secure Access
                    </span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 text-xs text-gray-500 font-mono flex-wrap">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> ENCRYPTED
                  </span>
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> ACTIVE
                  </span>
                </div>

                <div className="mt-6 p-3 bg-green-900/10 border border-green-500/20 rounded-sm text-xs text-green-200 font-mono">
                  <p>✓ Instant Access</p>
                  <p>✓ No Registration Required</p>
                  <p>✓ Phone + Email Support</p>
                </div>
              </div>
            )}

            {/* Email Login */}
            {loginMethod === 'email' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim() || !password.trim()) {
                  toast.error('Please enter email and password');
                  return;
                }
                loginWithEmail(email, password, displayName);
                setEmail('');
                setPassword('');
              }} className="space-y-4 pt-4">
                <button
                  type="button"
                  onClick={() => setLoginMethod('main')}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-mono mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="space-y-2">
                  <label className="block text-xs text-purple-400 font-mono uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-sm text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-purple-400 font-mono uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-sm text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                    data-testid="input-password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!email.trim() || !password.trim()}
                  className="w-full py-3 bg-purple-600 text-white hover:bg-purple-700 border border-purple-500/50 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-email-submit"
                >
                  LOGIN
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email-signup');
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                  }}
                  className="w-full text-xs text-purple-400 hover:text-purple-300 font-mono"
                >
                  Don't have an account? SIGN UP
                </button>

                <p className="text-xs text-gray-500 font-mono text-center">
                  Enter any email and password to continue
                </p>
              </form>
            )}

            {/* Email Signup */}
            {loginMethod === 'email-signup' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim() || !password.trim() || !displayName.trim()) {
                  toast.error('Please fill in all fields');
                  return;
                }
                loginWithEmail(email, password, displayName);
                setEmail('');
                setPassword('');
                setDisplayName('');
              }} className="space-y-4 pt-4">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-mono mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="space-y-2">
                  <label className="block text-xs text-purple-400 font-mono uppercase">
                    Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-sm text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                    data-testid="input-display-name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-purple-400 font-mono uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-sm text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                    data-testid="input-signup-email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-purple-400 font-mono uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-sm text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                    data-testid="input-signup-password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!email.trim() || !password.trim() || !displayName.trim()}
                  className="w-full py-3 bg-purple-600 text-white hover:bg-purple-700 border border-purple-500/50 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-signup-submit"
                >
                  CREATE ACCOUNT
                </Button>

                <p className="text-xs text-gray-500 font-mono text-center">
                  15 free scans included with every account
                </p>
              </form>
            )}

            {/* Phone Login */}
            {loginMethod === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4 pt-4">
                <button
                  type="button"
                  onClick={() => setLoginMethod('main')}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-mono mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="space-y-2">
                  <label className="block text-xs text-green-400 font-mono uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-sm text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!phoneNumber.trim()}
                  className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  SEND OTP
                </Button>

                <p className="text-xs text-gray-500 font-mono text-center">
                  We'll send a verification code to your phone
                </p>
              </form>
            )}

            {/* OTP Verification */}
            {loginMethod === 'otp' && (
              <form onSubmit={handleOTPSubmit} className="space-y-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('phone');
                    setOtp('');
                  }}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-mono mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="space-y-2">
                  <label className="block text-xs text-green-400 font-mono uppercase">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                    maxLength={4}
                    className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-sm text-white placeholder-gray-500 font-mono text-center text-2xl tracking-widest focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50"
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isVerifying}
                  disabled={otp.length !== 4}
                  className="w-full py-3 bg-green-600 text-white hover:bg-green-700 border border-green-500/50 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'VERIFYING...' : 'VERIFY OTP'}
                </Button>

                <p className="text-xs text-gray-500 font-mono text-center">
                  Enter the 4-digit code sent to your phone
                </p>
              </form>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
