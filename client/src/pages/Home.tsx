import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { GlitchText } from "@/components/GlitchText";
import { ShieldCheck, Zap, Search, ChevronRight, Lock, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 sm:px-6">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-10"
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-green-900/30 border border-green-500/30 text-green-400 text-xs font-mono tracking-widest mb-3 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          SYSTEM_ONLINE // READY_FOR_INPUT
        </motion.div>
        
        <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tighter leading-none text-white mb-2">
          <span className="opacity-50 text-2xl sm:text-3xl md:text-4xl block mb-2 font-mono font-normal tracking-widest text-green-500/50">DETECT. ANALYZE. VERIFY.</span>
          <GlitchText text="AUTHENTICITY" className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-200 to-green-500" />
          <br />
          <span className="text-outline-green text-transparent stroke-green-500 stroke-1">VERIFIED</span>
        </motion.h1>
        
        <motion.p variants={item} className="text-sm sm:text-base md:text-lg lg:text-xl text-green-100/60 max-w-2xl mx-auto leading-relaxed font-mono">
          Advanced neural network analysis for content originality. 
          Identify AI-generated patterns and plagiarism vectors with military-grade precision.
        </motion.p>
        
        <motion.div variants={item} className="flex flex-col w-full sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-4 sm:pt-8">
          <Link to="/checker" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-sm sm:text-lg group">
              <Cpu className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 group-hover:animate-spin" />
              Initiate Scan
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform" />
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-6 text-xs sm:text-lg font-mono"
            onClick={() => {
              const sampleText = `Artificial intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions), and self-correction. Particular applications of AI include expert systems, speech recognition and machine vision. AI can be categorized as either weak or strong. Weak AI, also known as narrow AI, is an AI system that is designed and trained for a particular task. Virtual personal assistants, such as Apple's Siri, are a form of weak AI. Strong AI, also known as artificial general intelligence, is an AI system with generalized human cognitive abilities. When presented with an unfamiliar task, a strong AI system is able to find a solution without human intervention.`;
              // We can navigate to checker and pass state, or save to localStorage
              localStorage.setItem('sampleText', sampleText);
              window.location.href = '/checker';
            }}
          >
            [ LOAD_SAMPLE_DATA ]
          </Button>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-16 sm:mt-24 md:mt-32 w-full"
      >
        <GlassCard hoverEffect className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 border-t-2 border-t-green-500">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-sm bg-green-900/20 border border-green-500/20 flex items-center justify-center mb-4 sm:mb-6">
            <Search className="w-6 sm:w-7 h-6 sm:h-7 text-green-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-heading text-white uppercase tracking-wider">Deep Sector Scan</h3>
          <p className="text-green-100/50 font-mono text-xs sm:text-sm leading-relaxed">
            Querying billions of indexed nodes to detect duplicate data strings and academic similarities.
          </p>
        </GlassCard>

        <GlassCard hoverEffect className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 border-t-2 border-t-green-500">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-sm bg-green-900/20 border border-green-500/20 flex items-center justify-center mb-4 sm:mb-6">
            <Zap className="w-6 sm:w-7 h-6 sm:h-7 text-green-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-heading text-white uppercase tracking-wider">Pattern Recognition</h3>
          <p className="text-green-100/50 font-mono text-xs sm:text-sm leading-relaxed">
            Neural heuristics identify GPT-4 and Claude syntax patterns with 99.8% probability accuracy.
          </p>
        </GlassCard>

        <GlassCard hoverEffect className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 border-t-2 border-t-green-500">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-sm bg-green-900/20 border border-green-500/20 flex items-center justify-center mb-4 sm:mb-6">
            <Lock className="w-6 sm:w-7 h-6 sm:h-7 text-green-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-heading text-white uppercase tracking-wider">Secure Processing</h3>
          <p className="text-green-100/50 font-mono text-xs sm:text-sm leading-relaxed">
            End-to-end encrypted analysis. Your data is processed in a secure ephemeral environment.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
