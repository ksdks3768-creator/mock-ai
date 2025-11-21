import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AppState, InterviewType, InterviewQuestion, InterviewResult, InterviewDifficulty, JobDetails, SavedInterviewSession } from './types';
import * as geminiService from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import InterviewScreen from './components/InterviewScreen';
import ProgressReportModal from './components/ProgressReportModal';
import CompletionScreen from './components/CompletionScreen';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [sessionForReport, setSessionForReport] = useState<InterviewResult[] | null>(null);
  
  // State to hold onto details for saving the session
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [interviewDifficulty, setInterviewDifficulty] = useState<InterviewDifficulty | null>(null);

  const handleStartInterview = useCallback(async (jd: string, type: InterviewType, difficulty: InterviewDifficulty) => {
    setAppState(AppState.GENERATING);
    setError(null);
    setInterviewType(type);
    setInterviewDifficulty(difficulty);
    try {
      const details = await geminiService.parseJobDescription(jd);
      setJobDetails(details);
      const generatedQuestions = await geminiService.generateQuestions(details, type, difficulty);
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setResults([]);
        setAppState(AppState.INTERVIEW);
      } else {
        throw new Error("The AI failed to generate questions. Please try again with a clearer job description.");
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while setting up the interview.";
      setError(errorMessage);
      setAppState(AppState.SETUP);
    }
  }, []);

  useEffect(() => {
    if (appState === AppState.COMPLETE && results.length > 0 && jobDetails && interviewType && interviewDifficulty) {
      const newSession: SavedInterviewSession = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        jobTitle: jobDetails.jobTitle,
        interviewType,
        difficulty: interviewDifficulty,
        results,
      };

      try {
        const saved = localStorage.getItem('ai-interview-coach-sessions');
        const sessions: SavedInterviewSession[] = saved ? JSON.parse(saved) : [];
        sessions.unshift(newSession); // Add to the beginning
        localStorage.setItem('ai-interview-coach-sessions', JSON.stringify(sessions));
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    }
  }, [appState, results, jobDetails, interviewType, interviewDifficulty]);

  const resetInterview = () => {
    setAppState(AppState.SETUP);
    // Reset state after transition completes
    setTimeout(() => {
      setQuestions([]);
      setResults([]);
      setError(null);
      setSessionForReport(null);
      setJobDetails(null);
      setInterviewType(null);
      setInterviewDifficulty(null);
    }, 500); // match transition duration
  }

  const handleViewPastSession = (resultsToView: InterviewResult[]) => {
    setSessionForReport(resultsToView);
  };

  const screenIndex = useMemo(() => {
    switch (appState) {
        case AppState.SETUP:
        case AppState.GENERATING:
            return 0;
        case AppState.INTERVIEW:
        case AppState.ANALYZING:
        case AppState.FEEDBACK:
            return 1;
        case AppState.COMPLETE:
            return 2;
        default:
            return 0;
    }
  }, [appState]);

  return (
    <div className="h-screen w-screen bg-brand-bg font-sans text-brand-text-dark selection:bg-brand-accent-green/30 overflow-hidden relative">
      <main className="h-full w-full relative">
        {/* Screen 0: Setup */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${(0 - screenIndex) * 100}%)` }}
        >
          <SetupScreen 
            onStart={handleStartInterview} 
            isLoading={appState === AppState.GENERATING}
            onViewPastSession={handleViewPastSession}
            error={error}
          />
        </div>

        {/* Screen 1: Interview */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${(1 - screenIndex) * 100}%)` }}
        >
          {questions.length > 0 && <InterviewScreen questions={questions} setResults={setResults} setAppState={setAppState} />}
        </div>
        
        {/* Screen 2: Completion */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${(2 - screenIndex) * 100}%)` }}
        >
           <CompletionScreen 
              onReset={resetInterview}
              onViewReport={() => setSessionForReport(results)}
           />
        </div>
      </main>

      {sessionForReport && (
        <ProgressReportModal
            onClose={() => setSessionForReport(null)}
            results={sessionForReport}
        />
      )}
    </div>
  );
};

export default App;