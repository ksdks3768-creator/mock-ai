import React, { useState, useEffect } from 'react';
import { InterviewType, InterviewDifficulty, SavedInterviewSession, InterviewResult } from '../types';
import { LoadingSpinner, LogoIcon, SendIcon, UserCircleIcon, CodeBracketIcon, UsersIcon } from './icons';
import PastSessionsList from './PastSessionsList';

interface SetupScreenProps {
  onStart: (jd: string, type: InterviewType, difficulty: InterviewDifficulty) => void;
  isLoading: boolean;
  onViewPastSession: (results: InterviewResult[]) => void;
  error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading, onViewPastSession, error }) => {
  const [jd, setJd] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>(InterviewType.TECHNICAL);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>(InterviewDifficulty.MEDIUM);
  const [pastSessions, setPastSessions] = useState<SavedInterviewSession[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai-interview-coach-sessions');
      if (saved) {
        const parsedSessions: SavedInterviewSession[] = JSON.parse(saved);
        // Sorting is handled when saving now, but we can keep it here as a fallback
        // parsedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPastSessions(parsedSessions);
      }
    } catch (error) {
      console.error("Failed to load past sessions:", error);
      localStorage.removeItem('ai-interview-coach-sessions');
    }
  }, [isLoading]); // Refresh list when returning to screen

  const handleStart = () => {
    if (jd.trim() && !isLoading) {
      onStart(jd, interviewType, difficulty);
    }
  };
  
  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = pastSessions.filter(s => s.id !== sessionId);
    setPastSessions(updatedSessions);
    localStorage.setItem('ai-interview-coach-sessions', JSON.stringify(updatedSessions));
  };

  const handleViewSession = (session: SavedInterviewSession) => {
      onViewPastSession(session.results);
  };

  const interviewTypes = [
    { type: InterviewType.HR, icon: <UserCircleIcon className="w-8 h-8" />, label: 'HR' },
    { type: InterviewType.TECHNICAL, icon: <CodeBracketIcon className="w-8 h-8" />, label: 'Technical' },
    { type: InterviewType.PANEL, icon: <UsersIcon className="w-8 h-8" />, label: 'Panel' },
  ];

  const difficultyLevels = [
    { level: InterviewDifficulty.EASY, color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-600' },
    { level: InterviewDifficulty.MEDIUM, color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-600' },
    { level: InterviewDifficulty.HARD, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-600' },
    { level: InterviewDifficulty.EXPERT, color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-600' },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-full flex flex-col">
        <header className="flex-shrink-0 flex justify-between items-center py-4">
          <LogoIcon className="w-8 h-8 text-brand-text-dark" />
        </header>

        <main className="flex-grow overflow-y-auto">
          {error && <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-2xl text-center">{error}</div>}
          
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="bg-brand-card p-6 rounded-3xl shadow-sm border border-gray-200/50 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-300 rounded w-5/6 mb-2"></div>
                <div className="h-32 bg-brand-input rounded-2xl"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 pb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-brand-text-dark">
                  Ready to ace your next interview?
                </h1>
                <p className="text-brand-text-light mt-2">
                  Paste a job description below, choose your interview style, and start practicing.
                </p>
              </div>
              
              <div className="relative">
                <textarea
                  rows={6}
                  className="w-full p-4 bg-brand-input border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-accent-green focus:border-brand-accent-green transition duration-200 resize-none placeholder:text-brand-text-light"
                  placeholder="Paste job description here..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-bold text-brand-text-dark mb-3">Select Interview Type</h2>
                  <div className="flex items-center justify-between gap-3">
                    {interviewTypes.map(({ type, icon, label }) => (
                      <button
                        key={type}
                        onClick={() => setInterviewType(type)}
                        disabled={isLoading}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                          interviewType === type
                            ? 'bg-brand-accent-green-light border-brand-accent-green text-brand-accent-green'
                            : 'bg-white border-gray-200 text-brand-text-light hover:border-gray-300'
                        }`}
                      >
                        {icon}
                        <span className="font-semibold text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-brand-text-dark mb-3">Select Difficulty</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 items-center justify-between gap-2">
                    {difficultyLevels.map(({ level, color, bgColor, borderColor }) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        disabled={isLoading}
                        className={`flex-1 flex items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 font-semibold text-sm ${
                          difficulty === level
                            ? `${bgColor} ${borderColor} ${color}`
                            : 'bg-white border-gray-200 text-brand-text-light hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h2 className="text-lg font-bold text-brand-text-dark mb-3">Past Sessions</h2>
                <PastSessionsList
                  sessions={pastSessions}
                  onView={handleViewSession}
                  onDelete={handleDeleteSession}
                />
              </div>

              <div className="pt-4">
                  <button
                    onClick={handleStart}
                    disabled={!jd.trim() || isLoading}
                    className="w-full flex justify-center items-center gap-3 bg-brand-text-dark text-white font-bold py-4 px-4 rounded-2xl hover:bg-black transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner className="w-5 h-5" />
                        Generating Your Interview...
                      </>
                    ) : (
                      <>
                      <SendIcon className="w-5 h-5" />
                      Start Your Mock Interview
                      </>
                    )}
                  </button>
              </div>
            </div>
          )}
        </main>
        <footer className="flex-shrink-0 text-center py-4 text-sm text-gray-400">
          <p>&copy; 2025 AI Interview Coach. created by DBS. </p>
        </footer>
      </div>
    </div>
  );
};

export default SetupScreen;