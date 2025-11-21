export enum AppState {
  SETUP,
  GENERATING,
  INTERVIEW,
  ANALYZING,
  FEEDBACK,
  COMPLETE,
}

export enum InterviewType {
  HR = "Human Resources",
  TECHNICAL = "Technical",
  PANEL = "Panel Interview",
}

export enum InterviewDifficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
  EXPERT = "Expert",
}

export interface JobDetails {
  jobTitle: string;
  skills: string[];
  responsibilities: string[];
}

export interface InterviewQuestion {
  question: string;
  persona: string;
  keywords: string[];
}

export interface AnswerFeedback {
  strengths: string[];
  weaknesses: string[];
  idealAnswer: string;
  spokenFeedback: string;
  score: number;
  rating: 'Beginner' | 'Intermediate' | 'Advanced';
  matchedKeywords: string[];
  missedKeywords: string[];
}

export interface InterviewResult {
  question: InterviewQuestion;
  answer: string;
  feedback: AnswerFeedback;
}

export interface SavedInterviewSession {
  id: string;
  date: string;
  jobTitle: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  results: InterviewResult[];
}