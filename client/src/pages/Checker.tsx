import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { checkAssignment, AnalysisResult } from "@/lib/api";
import { SAMPLE_ASSIGNMENTS } from "@/lib/sampleData";
import toast from "react-hot-toast";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { LoadingScreen } from "@/components/DigitalLoader";
import { PaymentModal } from "@/components/PaymentModal";
import { FileText, X, Terminal, Upload, Lock, AlertCircle, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Checker() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { user, scansRemaining, decrementScans, isPremium } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useState<HTMLInputElement | null>(null)[1];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type - only text files
    const allowedTypes = ['text/plain', 'text/markdown', 'application/json', 'text/csv', 'application/x-yaml', 'text/x-python'];
    const isTextFile = allowedTypes.includes(file.type) || file.name.match(/\.(txt|md|json|csv|yaml|py|js|ts|jsx|tsx)$/i);

    if (!isTextFile) {
      toast.error("FILE_TYPE_ERROR: TEXT_FILES_ONLY", {
        style: {
          background: '#000',
          color: '#ef4444',
          border: '1px solid #ef4444',
          fontFamily: 'monospace'
        }
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setText(content);
        toast.success(`FILE_LOADED: ${file.name}`);
      }
    };
    reader.onerror = () => {
      toast.error("FILE_READ_ERROR: UNABLE_TO_LOAD");
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Check for sample text
    const sampleText = localStorage.getItem('sampleText');
    if (sampleText) {
      setText(sampleText);
      localStorage.removeItem('sampleText'); // Clear it so it doesn't persist on refresh if unwanted
    }
  }, [user, navigate]);

  const handleCheck = async () => {
    if (!isPremium && scansRemaining <= 0) {
      setShowPayment(true);
      return;
    }

    if (text.trim().length < 50) {
      toast.error("INPUT_ERROR: MIN_LENGTH_50_CHARS_REQUIRED", {
        style: {
          background: '#000',
          color: '#4ade80',
          border: '1px solid #22c55e',
          fontFamily: 'monospace'
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await checkAssignment(text);
      localStorage.setItem("assignmentResults", JSON.stringify(data));
      
      // Decrement scans
      decrementScans();

      // Artificial delay to show the cool loader
      setTimeout(() => {
        navigate("/results");
      }, 2500);
      
    } catch (error) {
      console.error("API Error:", error);
      
      if (import.meta.env.DEV) {
        console.log("DEMO_MODE: ENABLED");
        const mockData: AnalysisResult = {
          plagiarismScore: Math.floor(Math.random() * 30),
          aiGeneratedProb: Math.floor(Math.random() * 100),
          grammarIssues: Math.floor(Math.random() * 12),
          readability: { score: Math.floor(Math.random() * 100) },
          summary: "Analysis complete. The input text demonstrates characteristics consistent with academic discourse on artificial intelligence. Several syntactical patterns suggest potential generative AI assistance in paragraph structuring.",
          topMatches: [
             { source: "DATABASE_NODE_8842 (Wikipedia)", score: 12 },
             { source: "ARCHIVE_SECTOR_7 (Academic Journal)", score: 8 },
             { source: "PUBLIC_NET_REF_99 (Tech Blog)", score: 5 }
          ]
        };
        localStorage.setItem("assignmentResults", JSON.stringify(mockData));
        
        // Decrement scans even in demo mode
        decrementScans();

        setTimeout(() => {
           navigate("/results");
        }, 3000); 
        return;
      }

      setIsLoading(false);
      toast.error("CONNECTION_FAILURE: RETRY_REQUIRED");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-5xl mx-auto w-full pt-6 sm:pt-10 px-4 sm:px-6">
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="inline-flex items-center px-3 py-1 rounded-sm bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs tracking-wider">
            <Terminal className="w-3 h-3 mr-2" />
            TERMINAL_ACCESS_GRANTED
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white">
            Input Data Stream
          </h1>
          
          {!isPremium && (
            <div className="flex flex-col sm:flex-row items-center gap-2 font-mono text-xs sm:text-sm mt-2">
              <span className={scansRemaining > 0 ? "text-green-400" : "text-red-500"}>
                REMAINING_CYCLES: {scansRemaining}/15
              </span>
              {scansRemaining === 0 && (
                <button onClick={() => setShowPayment(true)} className="text-yellow-400 hover:underline text-xs whitespace-nowrap">
                  [ UPGRADE_REQUIRED ]
                </button>
              )}
            </div>
          )}
        </div>

        <GlassCard className="p-1 bg-black/60 border-green-500/30 relative overflow-visible">
          {/* Premium Lock Overlay if out of scans */}
          {!isPremium && scansRemaining <= 0 && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-sm border border-green-500/20">
               <Lock className="w-12 h-12 text-yellow-500 mb-4" />
               <h3 className="text-2xl font-bold text-white font-heading mb-2">CYCLE LIMIT EXCEEDED</h3>
               <p className="text-gray-400 mb-6 max-w-md">Your free scan allocation has been depleted. Upgrade to Premium for unlimited access to the analysis engine.</p>
               <Button 
                 onClick={() => setShowPayment(true)}
                 className="bg-yellow-500 text-black hover:bg-yellow-400 border-none shadow-[0_0_20px_rgba(234,179,8,0.4)]"
               >
                 UNLOCK UNLIMITED ACCESS - ₹499
               </Button>
            </div>
          )}

          <div className="relative group">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-green-900/20 border-b border-green-500/20">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                 <div className="w-3 h-3 rounded-full bg-green-500/50" />
               </div>
               <div className="text-[10px] font-mono text-green-500/50">input.txt</div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="> _ Awaiting input stream..."
              disabled={!isPremium && scansRemaining <= 0}
              className="w-full h-64 sm:h-80 md:h-96 bg-black/80 p-4 sm:p-6 text-sm sm:text-base md:text-lg font-mono text-green-50 placeholder:text-green-900/50 resize-none focus:outline-none focus:ring-0 focus:bg-black/90 rounded-b-sm transition-all selection:bg-green-500/40 disabled:opacity-20"
              spellCheck={false}
            />
            
            {/* Character Count */}
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 px-2 sm:px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-sm text-xs font-mono text-green-400">
              BYTES: {text.length}
            </div>
            
            {/* Cursor Blink Effect Overlay */}
            {text.length === 0 && (!(!isPremium && scansRemaining <= 0)) && (
              <div className="absolute top-14 left-6 w-2 h-5 bg-green-500 animate-pulse pointer-events-none hidden sm:block" />
            )}
          </div>
        </GlassCard>

        {/* Sample Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-mono text-blue-400 uppercase tracking-wider">LOAD_SAMPLE_DATA</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {SAMPLE_ASSIGNMENTS.map((sample, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setText(sample.content);
                    toast.success(`Loaded: ${sample.title}`);
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="p-2 sm:p-3 bg-blue-900/20 border border-blue-500/30 rounded hover:border-blue-400 hover:bg-blue-900/40 transition-all group"
                >
                  <div className="text-xs font-mono text-blue-300 group-hover:text-blue-200 line-clamp-2 text-left">
                    {sample.title}
                  </div>
                  <div className="text-xs text-blue-400/50 group-hover:text-blue-400/70 mt-1 text-left line-clamp-1">
                    {sample.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <Button 
            variant="ghost" 
            onClick={() => setText("")}
            disabled={!text || isLoading}
            className="opacity-80 hover:opacity-100"
          >
            <X className="w-4 h-4 mr-2" />
            CLEAR_BUFFER
          </Button>

          <div className="flex gap-4 w-full sm:w-auto">
            <input
              ref={(el) => {
                if (el) fileInputRef(el);
              }}
              type="file"
              accept=".txt,.md,.json,.csv,.yaml,.yml,.py,.js,.ts,.jsx,.tsx"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="file-input-upload"
            />
            <Button 
              variant="secondary" 
              className="flex-1 sm:flex-none"
              onClick={() => {
                const fileInput = document.querySelector('[data-testid="file-input-upload"]') as HTMLInputElement;
                fileInput?.click();
              }}
              data-testid="button-upload-file"
            >
              <Upload className="w-4 h-4 mr-2" />
              UPLOAD_FILE
            </Button>
            <Button 
              onClick={handleCheck}
              className="flex-1 sm:flex-none px-10"
              disabled={!isPremium && scansRemaining <= 0}
              data-testid="button-execute-analysis"
            >
              <Terminal className="w-4 h-4 mr-2" />
              EXECUTE_ANALYSIS
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
