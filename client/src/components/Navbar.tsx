import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Terminal, LogIn, User, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button";

export function Navbar() {
  const { user, logout, scansRemaining, isPremium, upgradeToPremium } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/40 border-b border-green-500/20"
    >
      <Link to="/">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-sm border border-green-500/50 bg-black/50 group-hover:bg-green-500/20 group-hover:shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all duration-300">
            <Terminal className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-widest text-white font-heading">
              AI<span className="text-green-500">_CHECKER</span>
            </span>
            <span className="text-[10px] text-green-500/60 font-mono tracking-[0.2em]">SYS.V.2.0</span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/">
          <span className="hidden md:block text-xs font-mono text-green-500/70 cursor-pointer hover:text-green-400 hover:underline decoration-green-500/50 underline-offset-4 transition-colors">
            [ HOME ]
          </span>
        </Link>
        
        {user ? (
          <>
            <Link to="/checker">
              <span className="hidden md:block text-xs font-mono text-green-500/70 cursor-pointer hover:text-green-400 hover:underline decoration-green-500/50 underline-offset-4 transition-colors">
                [ ANALYZE ]
              </span>
            </Link>

            <Link to="/plans">
              <span className="hidden md:block text-xs font-mono text-green-500/70 cursor-pointer hover:text-green-400 hover:underline decoration-green-500/50 underline-offset-4 transition-colors">
                [ PLANS ]
              </span>
            </Link>

            <div className="h-4 w-px bg-green-500/20 hidden md:block" />

            {!isPremium && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-900/20 rounded border border-green-500/20">
                <span className="text-[10px] font-mono text-green-400">CREDITS: {scansRemaining}/15</span>
              </div>
            )}

            {isPremium && (
               <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded border border-yellow-500/30">
                 <Zap className="w-3 h-3 text-yellow-400" />
                 <span className="text-[10px] font-mono text-yellow-400">PREMIUM</span>
               </div>
            )}

            <div className="flex items-center gap-3">
               <Link to="/profile">
                 <div className="w-8 h-8 rounded-full border border-green-500/30 flex items-center justify-center bg-green-900/20 hover:bg-green-900/40 cursor-pointer transition-colors overflow-hidden">
                   {user?.profileImage ? (
                     <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-4 h-4 text-green-400" />
                   )}
                 </div>
               </Link>
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={logout}
                 className="text-xs hidden sm:flex"
               >
                 LOGOUT
               </Button>
            </div>
          </>
        ) : (
          <Link to="/login">
            <Button 
              variant="secondary"
              size="sm"
              className="text-xs font-mono"
            >
              <LogIn className="w-3 h-3 mr-2" />
              LOGIN_ACCESS
            </Button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
