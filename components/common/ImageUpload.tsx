
import React, { useState, useCallback, ChangeEvent } from 'react';

const UploadCloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" />
  </svg>
);

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  title: string;
  description: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, title, description }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, etc.).');
      setPreview(null);
      setFileName('');
      return;
    }
    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative group">
          <img src={preview} alt="Preview" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-md" />
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg cursor-pointer"
            onClick={() => document.getElementById('file-upload')?.click()}
            >
            <div className="text-center text-white">
                <UploadCloudIcon className="w-12 h-12 mx-auto"/>
                <p className="mt-2 font-semibold">Click to change image</p>
                <p className="text-sm">{fileName}</p>
            </div>
          </div>
           <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <label
          htmlFor="file-upload-main"
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700/50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloudIcon className="w-10 h-10 mb-3 text-slate-400" />
            <p className="mb-2 text-lg font-semibold text-slate-300">{title}</p>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
          <input
            id="file-upload-main"
            name="file-upload-main"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
