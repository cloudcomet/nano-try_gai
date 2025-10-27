
import React, { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ImageGenerate from './components/ImageGenerate';
import ImageEdit from './components/ImageEdit';
import VideoGenerate from './components/VideoGenerate';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GENERATE_IMAGE);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.GENERATE_IMAGE:
        return <ImageGenerate />;
      case Tab.EDIT_IMAGE:
        return <ImageEdit />;
      case Tab.GENERATE_VIDEO:
        return <VideoGenerate />;
      default:
        return <ImageGenerate />;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6 sm:mt-8 bg-slate-800/50 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/50">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini & Veo</p>
      </footer>
    </div>
  );
};

export default App;
