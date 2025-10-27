
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.5 3L7 7.5l3 1.5L11.5 12l1.5-3L16 7.5l-3-1.5z" /><path d="M5 21v-3.5L1.5 16l3.5-1.5L6.5 11l1.5 3.5 3.5 1.5-3.5 1.5z" /><path d="M18 21v-3.5l3.5-1.5-3.5-1.5L16.5 11l-1.5 3.5-3.5 1.5 3.5 1.5z" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-slate-700/50">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <SparklesIcon className="h-8 w-8 text-cyan-400" />
        <h1 className="ml-3 text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">
          Gemini Creative Suite
        </h1>
      </div>
    </header>
  );
};

export default Header;
