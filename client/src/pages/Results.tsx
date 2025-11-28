import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { GlitchText } from "@/components/GlitchText";
import { AlertTriangle, Bot, BookOpen, ArrowLeft, Share2, Download, Terminal, Lightbulb, Zap } from "lucide-react";
import { AnalysisResult } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from "react-hot-toast";
import html2pdf from 'html2pdf.js';

export default function Results() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const navigate = useNavigate();
  const reportId = Math.random().toString(36).substr(2, 9).toUpperCase();

  useEffect(() => {
    const stored = localStorage.getItem("assignmentResults");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse results", e);
        navigate("/checker");
      }
    } else {
      navigate("/checker");
    }
  }, [navigate]);

  const handleExportPDF = () => {
    const element = document.getElementById("analysis-report");
    if (!element) {
      toast.error("Could not generate PDF");
      return;
    }

    const opt = {
      margin: 10,
      filename: `AI_CHECKER_REPORT_${reportId}.pdf`,
      image: { type: 'png' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
    toast.success("PDF exported successfully!");
  };

  const handleShare = async () => {
    const shareText = `AI_CHECKER Analysis Report #${reportId}\n\nPlagiarism: ${data?.plagiarismScore ?? 0}%\nAI Generated: ${data?.aiGeneratedProb ?? 0}%\nGrammar Issues: ${data?.grammarIssues ?? 0}\nCredit Score: ${data?.creditScore ?? 15}/15\n\nCheck the full analysis at AI_CHECKER!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI_CHECKER Report #${reportId}`,
          text: shareText,
        });
        toast.success("Report shared!");
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast.success("Report copied to clipboard!");
    }
  };

  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score < 20) return "text-green-400 shadow-green-500";
    if (score < 50) return "text-yellow-400 shadow-yellow-500";
    return "text-red-500 shadow-red-500";
  };

  // Safe access to values
  const plagiarismScore = data?.plagiarismScore ?? 0;
  const aiGeneratedProb = data?.aiGeneratedProb ?? 0;
  const grammarIssues = data?.grammarIssues ?? 0;
  const readabilityScore = data?.readability?.score ?? 75;
  const creditScore = data?.creditScore ?? 15;
  const summary = data?.summary || "No summary available.";
  const topMatches = data?.topMatches || [];

  // Data for charts
  const chartData = [
    { name: 'Plagiarism', value: plagiarismScore, color: plagiarismScore > 50 ? '#ef4444' : '#4ade80' },
    { name: 'AI Content', value: aiGeneratedProb, color: aiGeneratedProb > 50 ? '#ef4444' : '#4ade80' },
    { name: 'Readability', value: readabilityScore, color: '#22d3ee' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10" id="analysis-report">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <Button variant="ghost" onClick={() => navigate("/checker")} className="mb-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            RETURN_TO_TERMINAL
          </Button>
          <h1 className="text-4xl font-bold font-heading text-white">
            <GlitchText text="ANALYSIS_COMPLETE" />
          </h1>
          <p className="text-green-100/50 font-mono text-sm mt-2">REPORT_ID: {reportId}</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            SHARE
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            EXPORT_PDF
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Credit Score */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-4 border-t-2 border-t-yellow-500 min-h-[300px]">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-yellow-400 font-mono tracking-widest">CREDIT_SCORE</h3>
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-2 border-yellow-500/50 bg-black/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-5xl font-bold text-yellow-300 font-heading" style={{ textShadow: "0 0 10px rgba(253, 224, 71, 0.6)" }}>
                    {creditScore}
                  </div>
                  <div className="text-xs text-yellow-400 font-mono mt-1">/15</div>
                </div>
              </div>
            </motion.div>
            <p className="text-xs text-yellow-300/70 mt-6 font-mono uppercase">Document Quality Score</p>
          </div>
          
          <div className="w-full p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-sm text-left">
            <div className="flex items-center text-xs text-yellow-300 font-mono">
              ✓ {creditScore >= 12 ? "EXCELLENT" : creditScore >= 8 ? "GOOD" : "NEEDS IMPROVEMENT"}
            </div>
          </div>
        </GlassCard>

        {/* Plagiarism Radar Scanner */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6 border-t-2 border-t-green-500 min-h-[300px]">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Radar Grid */}
            <div className="absolute inset-0 rounded-full border border-green-900/50" />
            <div className="absolute inset-4 rounded-full border border-green-900/50" />
            <div className="absolute inset-8 rounded-full border border-green-900/50" />
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(0,255,0,0.2)_360deg)] animate-[spin_3s_linear_infinite] rounded-full" />
            
            <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#022c22" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray="283"
                strokeDashoffset="283"
                animate={{ strokeDashoffset: 283 - (283 * plagiarismScore) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={`${getScoreColor(plagiarismScore)} drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]`}
                strokeLinecap="square"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-full m-8 border border-green-500/30">
              <span className={`text-4xl font-bold font-mono ${getScoreColor(plagiarismScore)}`}>
                {plagiarismScore}%
              </span>
              <span className="text-[10px] text-green-500/50 tracking-widest mt-1">PLAGIARISM</span>
            </div>
          </div>
          <div className="font-mono text-xs text-green-400/70 uppercase tracking-wide">
            {plagiarismScore < 20 ? ">> NO_SIGNIFICANT_MATCHES" : ">> MATCHES_DETECTED_IN_DB"}
          </div>
        </GlassCard>

        {/* Metric Analysis Chart (New Feature) */}
        <GlassCard className="p-6 flex flex-col justify-between text-center border-t-2 border-t-cyan-500 min-h-[300px]">
           <div className="w-full flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-cyan-400 font-mono tracking-widest">METRIC_OVERVIEW</h3>
            <Bot className="w-4 h-4 text-cyan-500" />
          </div>
          
          <div className="flex-1 w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{fill: '#4ade80', fontSize: 10}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#22c55e', color: '#fff' }}
                  cursor={{fill: 'rgba(255,255,255,0.1)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-mono text-gray-400">
             <div>
                <div className="text-white font-bold">{plagiarismScore}%</div>
                <div className="text-[10px]">ORIGINALITY</div>
             </div>
             <div>
                <div className="text-white font-bold">{aiGeneratedProb}%</div>
                <div className="text-[10px]">AI PROB</div>
             </div>
             <div>
                <div className="text-white font-bold">{readabilityScore}%</div>
                <div className="text-[10px]">READABILITY</div>
             </div>
          </div>
        </GlassCard>

        {/* Grammar Glitch Counter */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-4 border-t-2 border-t-purple-500 min-h-[300px]">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-purple-400 font-mono tracking-widest">SYNTAX_ERRORS</h3>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-purple-500/5 animate-pulse rounded-full blur-xl" />
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
               <h2 className="text-8xl font-bold text-white font-heading relative z-10" style={{ textShadow: "4px 4px 0px rgba(168, 85, 247, 0.4)" }}>
                 {grammarIssues}
               </h2>
               {/* Glitch Copies */}
               <div className="absolute top-0 left-0 text-8xl font-bold text-purple-500 opacity-30 animate-ping font-heading select-none">
                 {grammarIssues}
               </div>
            </motion.div>
            <p className="text-xs text-purple-300/70 mt-4 font-mono uppercase">Issues flagged for review</p>
          </div>
          
          <div className="w-full p-3 bg-purple-900/20 border border-purple-500/20 rounded-sm text-left">
            <div className="flex items-center text-xs text-purple-300 font-mono mb-1">
              <AlertTriangle className="w-3 h-3 mr-2" />
              RECOMMENDATION:
            </div>
            <div className="text-xs text-purple-100/50 truncate">
               Run syntax optimization protocol.
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Section */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <Bot className="w-24 h-24 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-green-400 font-mono mb-6 flex items-center gap-2 border-b border-green-500/30 pb-2 w-fit">
              <Terminal className="w-4 h-4" />
              EXECUTIVE_SUMMARY
            </h3>
            <p className="text-green-50/80 leading-relaxed font-mono text-sm">
              {summary}
            </p>
          </GlassCard>

          {/* Suggestions Layout (New Feature) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <GlassCard className="p-4 border-l-2 border-l-yellow-500 bg-yellow-900/10">
               <div className="flex items-start gap-3">
                 <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 shrink-0" />
                 <div>
                   <h4 className="text-white font-bold text-sm font-mono mb-1">VOCABULARY ENHANCEMENT</h4>
                   <p className="text-xs text-gray-400">Consider using more varied transition words to improve flow between paragraphs.</p>
                 </div>
               </div>
             </GlassCard>
             <GlassCard className="p-4 border-l-2 border-l-blue-500 bg-blue-900/10">
               <div className="flex items-start gap-3">
                 <Lightbulb className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                 <div>
                   <h4 className="text-white font-bold text-sm font-mono mb-1">SENTENCE STRUCTURE</h4>
                   <p className="text-xs text-gray-400">Break down complex compound sentences in the introduction for better clarity.</p>
                 </div>
               </div>
             </GlassCard>
          </div>
        </div>

        {/* Matches List */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full p-6">
            <h3 className="text-lg font-bold text-yellow-400 font-mono mb-6 flex items-center gap-2 border-b border-yellow-500/30 pb-2">
              <AlertTriangle className="w-4 h-4" />
              DATA_MATCHES
            </h3>
            <div className="space-y-4">
              {topMatches.map((match, index) => (
                <div key={index} className="p-4 rounded-sm bg-black/40 border border-white/5 hover:border-yellow-500/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-green-200 font-mono truncate w-3/4 group-hover:text-yellow-200 transition-colors">{match.source}</span>
                    <span className="text-xs font-bold text-red-400 bg-red-950/30 px-1 rounded border border-red-900/50">{match.score}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]" 
                      style={{ width: `${match.score}%` }}
                    />
                  </div>
                </div>
              ))}
              {topMatches.length === 0 && (
                 <div className="text-xs text-green-500/50 font-mono italic text-center py-4 border border-dashed border-green-900 rounded">
                   &gt;&gt; NO_DATA_CORRELATIONS_FOUND
                 </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
