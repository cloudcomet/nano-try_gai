import React, { useState, useCallback, useEffect } from 'react';
import { generateVideo } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import ImageUpload from './common/ImageUpload';
import Spinner from './common/Spinner';
import Button from './common/Button';

// Assume window.aistudio is available for Veo API key selection
// FIX: Defined a named interface `AIStudio` and used it for `window.aistudio` to resolve a TypeScript error about subsequent property declarations needing the same type.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}
declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}

const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" />
  </svg>
);

const ApiKeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16.5 10-4.4-4.4a1 1 0 0 0-1.4 0L2 14.2a1 1 0 0 0 0 1.4l4.4 4.4a1 1 0 0 0 1.4 0l8.1-8.1"/><path d="m21 5-2.6 2.6"/><path d="m6.5 12.5 1 1"/></svg>
);

const VideoGenerate: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Optimistically assume key selection was successful to avoid race conditions.
      setApiKeyReady(true);
    } else {
        setError("API key selection module is not available.");
    }
  };
  
  const handleGenerate = useCallback(async () => {
    if (!prompt || !sourceImage) {
      setError('Please upload an image and provide a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedVideo(null);
    setLoadingMessage('Preparing your request...');

    try {
      const imageBase64 = await fileToBase64(sourceImage);
      const mimeType = sourceImage.type;
      const videoUrl = await generateVideo(prompt, imageBase64, mimeType, aspectRatio, setLoadingMessage);
      setGeneratedVideo(videoUrl);
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(e);
      if (errorMessage.includes('Requested entity was not found')) {
        setError("API Key error. Please re-select your API key.");
        setApiKeyReady(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, sourceImage, aspectRatio]);

  if (!apiKeyReady) {
    return (
        <div className="text-center p-8 bg-slate-900/50 rounded-lg">
            <ApiKeyIcon className="w-12 h-12 mx-auto text-yellow-400"/>
            <h2 className="mt-4 text-xl font-bold">API Key Required for Video Generation</h2>
            <p className="mt-2 text-slate-400">
                To use the Veo video generation feature, you need to select an API key. This will open a dialog to choose your key.
            </p>
            <p className="mt-2 text-slate-400 text-sm">
                For more information, please refer to the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">billing documentation</a>.
            </p>
            <div className="mt-6">
                <Button onClick={handleSelectKey} Icon={ApiKeyIcon} variant="primary">
                    Select API Key
                </Button>
            </div>
            {error && <div className="mt-4 text-red-500">{error}</div>}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <ImageUpload
          onImageSelect={setSourceImage}
          title="Upload a Starting Image"
          description="This image will be the first frame of your video"
        />
        <div>
          <label htmlFor="video-prompt" className="block text-sm font-medium text-slate-300 mb-2">
            Video Prompt
          </label>
          <textarea
            id="video-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A neon hologram of a cat driving at top speed"
            className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 transition"
            disabled={!sourceImage}
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
            <div className="flex gap-4">
                <button onClick={() => setAspectRatio('16:9')} className={`px-4 py-2 rounded-full border transition-colors ${aspectRatio === '16:9' ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>Landscape (16:9)</button>
                <button onClick={() => setAspectRatio('9:16')} className={`px-4 py-2 rounded-full border transition-colors ${aspectRatio === '9:16' ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>Portrait (9:16)</button>
            </div>
        </div>
        <div className="flex justify-center">
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt || !sourceImage} Icon={VideoIcon}>
                Generate Video
            </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-center mb-4 text-slate-300">Result</h3>
        <div className="w-full flex-grow flex justify-center items-center min-h-[300px] bg-slate-900/50 rounded-lg p-4">
          {isLoading ? (
            <Spinner message={loadingMessage} />
          ) : generatedVideo ? (
            <video src={generatedVideo} controls autoPlay loop className="max-w-full max-h-[60vh] h-auto rounded-md shadow-lg" />
          ) : (
            <div className="text-center text-slate-500">
                <VideoIcon className="mx-auto h-12 w-12" />
                <p className="mt-2">Your generated video will appear here.</p>
            </div>
          )}
        </div>
        {error && <div className="mt-4 text-red-500 text-center bg-red-900/20 p-3 rounded-md">{error}</div>}
      </div>
    </div>
  );
};

export default VideoGenerate;