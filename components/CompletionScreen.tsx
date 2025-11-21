import React from 'react';
import { HomeIcon, GridIcon } from './icons';

interface CompletionScreenProps {
    onReset: () => void;
    onViewReport: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onReset, onViewReport }) => {
    return (
        <div className="w-full h-full mx-auto p-4 md:p-0 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold text-brand-text-dark">Interview Complete!</h1>
            <p className="text-brand-text-light mt-4 text-lg">
                Congratulations on finishing your practice session. You're one step closer to your goal!
            </p>
            <p className="text-brand-text-light mt-2">
                View your detailed report or start a new interview using the controls below.
            </p>

            {/* Floating Nav Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md shadow-2xl shadow-gray-500/10 rounded-full p-2 border border-gray-200/80">
                <button 
                  onClick={onReset}
                  className="flex items-center justify-center w-16 h-16 bg-brand-text-dark rounded-full text-white shadow-lg transform hover:scale-105 transition-transform"
                  aria-label="Start New Interview"
                >
                  <HomeIcon className="w-8 h-8" />
                </button>
                <button 
                  onClick={onViewReport}
                  className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full text-brand-text-light transform hover:scale-105 hover:bg-gray-200 hover:text-brand-text-dark transition-all"
                   aria-label="View Report"
                >
                  <GridIcon className="w-7 h-7" />
                </button>
              </div>
            </div>
        </div>
    );
};

export default CompletionScreen;
