"use client";

import { useState } from 'react';
import { cloudinaryService } from '../../lib/cloudinary';
import ImageUpload from '../../components/ImageUpload';

export default function CloudinaryTestPage() {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (result: any) => {
    setUploadResult(result);
    setError(null);
  };

  const handleError = (err: any) => {
    setError(err.message);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Cloudinary Configuration Test</h1>
        
        {/* Configuration Status */}
        <div className="bg-card/20 rounded-xl p-6 border border-border/5 backdrop-blur-sm mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-gray">Cloud Name:</span>
              <span className={`font-mono text-sm ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'text-green-400' : 'text-red-400'}`}>
                {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-gray">Upload Preset:</span>
              <span className={`font-mono text-sm ${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? 'text-green-400' : 'text-red-400'}`}>
                {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-gray">Service Status:</span>
              <span className={`font-mono text-sm ${cloudinaryService.isConfigured() ? 'text-green-400' : 'text-red-400'}`}>
                {cloudinaryService.isConfigured() ? 'Configured' : 'Not Configured'}
              </span>
            </div>
          </div>
        </div>

        {/* Upload Test */}
        <div className="bg-card/20 rounded-xl p-6 border border-border/5 backdrop-blur-sm mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upload Test</h2>
          <ImageUpload
            onUpload={handleUpload}
            accept="image"
            maxSize={5}
            placeholder="Test image upload"
          />
        </div>

        {/* Results */}
        {uploadResult && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Upload Successful!</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-gray">Public ID:</span>
                <span className="font-mono text-sm text-white">{uploadResult.public_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-gray">URL:</span>
                <span className="font-mono text-sm text-white break-all">{uploadResult.secure_url}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-gray">Format:</span>
                <span className="font-mono text-sm text-white">{uploadResult.format}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-gray">Size:</span>
                <span className="font-mono text-sm text-white">{uploadResult.width} x {uploadResult.height}</span>
              </div>
            </div>
            {uploadResult.secure_url && (
              <div className="mt-4">
                <img 
                  src={uploadResult.secure_url} 
                  alt="Uploaded" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Upload Failed</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Setup Instructions</h3>
          <div className="space-y-3 text-slate-gray text-sm">
            <p>1. Create a Cloudinary account at <a href="https://cloudinary.com" className="text-blue-400 hover:underline">cloudinary.com</a></p>
            <p>2. Get your Cloud Name from the dashboard</p>
            <p>3. Create an upload preset in Settings → Upload → Upload presets</p>
            <p>4. Add these environment variables to your <code className="bg-slate-800 px-2 py-1 rounded">.env.local</code> file:</p>
            <div className="bg-slate-800 p-4 rounded-lg font-mono text-xs">
              NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name<br/>
              NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
            </div>
            <p>5. Restart your development server</p>
          </div>
        </div>
      </div>
    </div>
  );
}

