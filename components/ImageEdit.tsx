
import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import ImageUpload from './common/ImageUpload';
import Spinner from './common/Spinner';
import Button from './common/Button';

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" x2="22" y1="2" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path>
  </svg>
);

const ImageEdit: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setOriginalImage(file);
    setEditedImage(null);
  };

  const handleEdit = useCallback(async () => {
    if (!prompt || !originalImage) {
      setError('Please upload an image and provide an editing instruction.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const imageBase64 = await fileToBase64(originalImage);
      const mimeType = originalImage.type;
      const resultUrl = await editImage(prompt, imageBase64, mimeType);
      setEditedImage(resultUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during editing.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, originalImage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <ImageUpload
          onImageSelect={handleImageSelect}
          title="Upload an Image to Edit"
          description="Drag 'n' drop or click to select"
        />
        <div>
          <label htmlFor="edit-prompt" className="block text-sm font-medium text-slate-300 mb-2">
            Editing Instructions
          </label>
          <textarea
            id="edit-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a retro filter, or remove the person in the background"
            className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 transition"
            disabled={!originalImage}
          />
        </div>
        <div className="flex justify-center">
            <Button onClick={handleEdit} isLoading={isLoading} disabled={!prompt || !originalImage} Icon={PencilIcon}>
                Apply Edit
            </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-center mb-4 text-slate-300">Result</h3>
        <div className="w-full flex-grow flex justify-center items-center min-h-[300px] bg-slate-900/50 rounded-lg p-4">
          {isLoading ? (
            <Spinner message="Applying your edits..." />
          ) : editedImage ? (
            <img src={editedImage} alt="Edited" className="max-w-full max-h-[60vh] h-auto rounded-md shadow-lg" />
          ) : (
            <div className="text-center text-slate-500">
                <PencilIcon className="mx-auto h-12 w-12" />
                <p className="mt-2">Your edited image will appear here.</p>
            </div>
          )}
        </div>
        {error && <div className="mt-4 text-red-500 text-center bg-red-900/20 p-3 rounded-md">{error}</div>}
      </div>
    </div>
  );
};

export default ImageEdit;
