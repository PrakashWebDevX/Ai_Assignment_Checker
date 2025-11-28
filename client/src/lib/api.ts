import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000/api";

export interface BackendAnalysisResponse {
  plagiarism_score: number;
  top_matches: { source: string; score: number }[];
  ai_generated_prob: number;
  grammar_issues: number;
  readability: { score: number };
  summary: string;
  credit_score?: number;
}

export interface AnalysisResult {
  plagiarismScore: number;
  topMatches: { source: string; score: number }[];
  aiGeneratedProb: number;
  grammarIssues: number;
  readability: { score: number };
  summary: string;
  creditScore: number;
}

const formatAnalysisResult = (data: BackendAnalysisResponse): AnalysisResult => {
  // Generate random credit score (15 is max) if not provided
  const creditScore = data.credit_score ?? Math.floor(Math.random() * 16);
  
  return {
    plagiarismScore: data.plagiarism_score ?? 0,
    topMatches: (data.top_matches || []).map(match => ({
      source: match.source || "Unknown Source",
      score: match.score ?? 0
    })),
    aiGeneratedProb: data.ai_generated_prob ?? 0,
    grammarIssues: data.grammar_issues ?? 0,
    readability: {
      score: data.readability?.score ?? 0
    },
    summary: data.summary || "No summary available.",
    creditScore
  };
};

export const checkAssignment = async (text: string): Promise<AnalysisResult> => {
  const res = await axios.post<BackendAnalysisResponse>("/assignment/check", { text });
  return formatAnalysisResult(res.data);
};
