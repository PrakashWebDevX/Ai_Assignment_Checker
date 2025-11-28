import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface MockUser {
  id: string;
  displayName: string;
  phone?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<MockUser>) => Promise<void>;
  scansRemaining: number;
  isPremium: boolean;
  decrementScans: () => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [scansRemaining, setScansRemaining] = useState(15);
  const [isPremium, setIsPremium] = useState(false);
  const [pendingPhoneOTP, setPendingPhoneOTP] = useState<{phone: string; otp: string} | null>(null);

  useEffect(() => {
    // Load persisted state
    const savedUser = localStorage.getItem('mockUser');
    const savedScans = localStorage.getItem('scansRemaining');
    const savedPremium = localStorage.getItem('isPremium');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedScans) setScansRemaining(parseInt(savedScans));
    if (savedPremium) setIsPremium(savedPremium === 'true');

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('scansRemaining', scansRemaining.toString());
    localStorage.setItem('isPremium', isPremium.toString());
  }, [user, scansRemaining, isPremium]);

  const login = async () => {
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockUser: MockUser = {
        id: `user_${Date.now()}`,
        displayName: 'User'
      };

      setUser(mockUser);
      toast.success(`Welcome, ${mockUser.displayName}!`);
    } catch (error) {
      toast.error('Login failed');
      console.error('Login error:', error);
    }
  };

  const loginWithPhone = async (phoneNumber: string) => {
    try {
      // Validate phone number format
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        toast.error('Please enter a valid phone number');
        return;
      }

      // Generate mock OTP (in real app, this would be sent via SMS)
      const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
      setPendingPhoneOTP({ phone: phoneNumber, otp: generatedOTP });

      // For demo, log the OTP to console
      console.log(`[DEMO] OTP for ${phoneNumber}: ${generatedOTP}`);
      toast.success(`OTP sent to ${phoneNumber}\n[Demo: ${generatedOTP}]`);
    } catch (error) {
      toast.error('Failed to send OTP');
      console.error('Phone login error:', error);
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      if (!pendingPhoneOTP) {
        toast.error('No pending phone verification');
        return false;
      }

      // Simulate OTP verification delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // Mock verification: accept any 4-digit OTP or exact match
      if (otp.length !== 4 || isNaN(Number(otp))) {
        toast.error('Invalid OTP format');
        return false;
      }

      // In demo, accept any 4-digit number. In real app, verify against sent OTP
      const mockUser: MockUser = {
        id: `user_${Date.now()}`,
        displayName: pendingPhoneOTP.phone,
        phone: pendingPhoneOTP.phone
      };

      setUser(mockUser);
      setPendingPhoneOTP(null);
      toast.success(`Welcome, ${pendingPhoneOTP.phone}!`);
      return true;
    } catch (error) {
      toast.error('OTP verification failed');
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const loginWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate password length
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      // Simulate email auth delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create mock user with email
      const mockUser: MockUser = {
        id: `user_${Date.now()}`,
        displayName: displayName || email.split('@')[0],
      };

      setUser(mockUser);
      // Reset scans to 15 for new users
      setScansRemaining(15);
      toast.success(`Welcome, ${mockUser.displayName}!`);
    } catch (error) {
      toast.error('Email login failed');
      console.error('Email login error:', error);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setPendingPhoneOTP(null);
      localStorage.removeItem('mockUser');
      toast.success('Logged out successfully.');
    } catch (error: any) {
      toast.error('Logout failed: ' + (error.message || 'Unknown error'));
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (updates: Partial<MockUser>) => {
    try {
      if (!user) {
        toast.error('No user logged in');
        return;
      }

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  const decrementScans = () => {
    if (isPremium) return;
    if (scansRemaining > 0) {
      setScansRemaining(prev => prev - 1);
    }
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
    setScansRemaining(Infinity);
    toast.success('🎉 Premium Activated! Unlimited Scans.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithPhone,
        verifyOTP,
        loginWithEmail,
        logout,
        updateUserProfile,
        scansRemaining,
        isPremium,
        decrementScans,
        upgradeToPremium
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
