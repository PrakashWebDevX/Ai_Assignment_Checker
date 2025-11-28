import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { ArrowLeft, User, Phone, Zap, Award, Calendar, Upload } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Profile() {
  const { user, loading, scansRemaining, isPremium, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-400 font-mono">LOADING_PROFILE...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      await updateUserProfile({ profileImage: imageData });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-4 pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK_HOME
        </Button>
        
        <div>
          <h1 className="text-4xl font-bold font-heading text-white mb-2">
            USER_PROFILE
          </h1>
          <p className="text-green-100/50 font-mono text-sm">
            ACCOUNT_INFORMATION_SYSTEM
          </p>
        </div>
      </motion.div>

      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-8 border-t-4 border-t-green-500">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar with Upload */}
            <div className="flex-shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-2 border-green-500/50 bg-black/50 overflow-hidden cursor-pointer hover:border-green-400 transition-colors" onClick={() => fileInputRef.current?.click()}>
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-green-400" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300">
                    <Upload className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </motion.div>
              <p className="text-xs text-green-400/50 text-center mt-3 font-mono">CLICK TO UPLOAD</p>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-xs text-green-400 font-mono uppercase mb-1">
                  Display Name
                </p>
                <h2 className="text-3xl font-bold text-white font-heading">
                  {user.displayName || 'User'}
                </h2>
              </div>

              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  <p className="text-green-100/80 font-mono">{user.phone}</p>
                </div>
              )}

              <div className="pt-4 flex flex-col md:flex-row gap-3">
                <Button
                  onClick={handleLogout}
                  className="bg-red-600/80 text-white hover:bg-red-700 border border-red-500/50"
                >
                  LOGOUT_SYSTEM
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Scans Remaining */}
        <GlassCard className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-blue-400 font-mono uppercase mb-2">
                Scans Remaining
              </p>
              <p className="text-4xl font-bold text-blue-300 font-heading">
                {scansRemaining}
              </p>
              <p className="text-xs text-blue-200/50 mt-2 font-mono">
                out of 15 free scans
              </p>
            </div>
            <Award className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </GlassCard>

        {/* Account Status */}
        <GlassCard className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-yellow-400 font-mono uppercase mb-2">
                Account Status
              </p>
              <p className="text-2xl font-bold text-yellow-300 font-heading">
                {isPremium ? 'PREMIUM' : 'FREE'}
              </p>
              <p className="text-xs text-yellow-200/50 mt-2 font-mono">
                {isPremium ? 'Unlimited scans' : 'Limited scans'}
              </p>
            </div>
            <Zap className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
        </GlassCard>

        {/* User ID */}
        <GlassCard className="p-6 border-l-4 border-l-purple-500 md:col-span-2">
          <div>
            <p className="text-xs text-purple-400 font-mono uppercase mb-2">
              User Identifier
            </p>
            <p className="text-sm text-purple-200 font-mono break-all">
              {user.id}
            </p>
          </div>
        </GlassCard>

        {/* Account Created */}
        <GlassCard className="p-6 border-l-4 border-l-cyan-500 md:col-span-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-cyan-400 font-mono uppercase mb-2">
                Account Created
              </p>
              <p className="text-sm text-cyan-200 font-mono">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <Calendar className="w-6 h-6 text-cyan-400 opacity-50" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <Button
          onClick={() => navigate("/checker")}
          className="flex-1 bg-green-600 text-white hover:bg-green-700 border border-green-500/50"
        >
          START_SCANNING
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex-1"
        >
          RETURN_HOME
        </Button>
      </motion.div>
    </div>
  );
}
