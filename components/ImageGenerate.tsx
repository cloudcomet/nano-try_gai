
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import Button from './common/Button';
import { AspectRatio } from '../types';

const ImageGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v18" /><path d="M16.74 7.82a4 4 0 0 1-1.42 5.66l-2.43 1.41" /><path d="m12 12.5 4.5-2.6" /><path d="M12 12.5 7.5 15.1" /><path d="M17.5 16.5 12 14l-5.5 2.5" /><path d="m12 3 4.5 2.6" /><path d="M3.26 7.82a4 4 0 0 0 1.42 5.66l2.43 1.41" /><path d="M7.5 10.4 12 12.5" />
  </svg>
);

const aspectRatios: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: 'Square' },
    { value: '16:9', label: 'Landscape' },
    { value: '9:16', label: 'Portrait' },
    { value: '4:3', label: 'Wide' },
    { value: '3:4', label: 'Tall' },
];

const ImageGenerate: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
          Enter your creative prompt
        </label>
        <textarea
          id="prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A surrealist painting of a cat playing a piano in space"
          className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
        <div className="flex flex-wrap gap-2">
            {aspectRatios.map(ar => (
                <button key={ar.value} onClick={() => setAspectRatio(ar.value)}
                    className={`px-4 py-2 text-sm rounded-full border transition-colors ${aspectRatio === ar.value ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>
                    {ar.label}
                </button>
            ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt} Icon={ImageGeneratorIcon}>
          Generate Image
        </Button>
      </div>

      {error && <div className="text-red-500 text-center bg-red-900/20 p-3 rounded-md">{error}</div>}

      <div className="w-full flex justify-center items-center min-h-[300px] bg-slate-900/50 rounded-lg p-4">
        {isLoading ? (
          <Spinner message="Generating your masterpiece..." />
        ) : generatedImage ? (
          <img src={generatedImage} alt="Generated" className="max-w-full max-h-[60vh] h-auto rounded-md shadow-lg" />
        ) : (
          <div className="text-center text-slate-500">
            <ImageGeneratorIcon className="mx-auto h-12 w-12" />
            <p className="mt-2">Your generated image will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerate;
