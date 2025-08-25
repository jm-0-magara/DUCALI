"use client";

import { useState } from 'react';
import { cloudinaryService } from '../../lib/cloudinary';

export default function TestUploadPage() {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);



      const result = await cloudinaryService.uploadImage(selectedFile, {
        folder: 'ducali/test'
      });

      setUploadResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Cloudinary Upload Test</h1>
        
        {/* Configuration Status */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Cloud Name:</span>
              <span className={`font-mono text-sm ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'text-green-400' : 'text-red-400'}`}>
                {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Upload Preset:</span>
              <span className={`font-mono text-sm ${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? 'text-green-400' : 'text-red-400'}`}>
                {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Service Status:</span>
              <span className={`font-mono text-sm ${cloudinaryService.isConfigured() ? 'text-green-400' : 'text-red-400'}`}>
                {cloudinaryService.isConfigured() ? 'Configured' : 'Not Configured'}
              </span>
            </div>
          </div>
        </div>

        {/* Upload Test */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upload Test</h2>
          
          <div className="space-y-4">
            {/* File Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Select Image File:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A4B465] file:text-white hover:file:bg-[#626F47] file:cursor-pointer cursor-pointer"
              />
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-slate-300 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                selectedFile && !isUploading
                  ? 'bg-[#A4B465] hover:bg-[#626F47] text-white cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload to Cloudinary'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {uploadResult && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Upload Successful!</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Public ID:</span>
                <span className="font-mono text-sm text-white">{uploadResult.public_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Format:</span>
                <span className="font-mono text-sm text-white">{uploadResult.format}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Size:</span>
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
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">❌ Upload Failed</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Next Steps</h3>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>✅ If upload was successful, your Cloudinary is working correctly!</p>
            <p>✅ You can now use profile picture upload in the admin settings</p>
            <p>✅ Artisans can upload portfolio images and videos</p>
            <p>🔗 <a href="/dashboard/admin?tab=settings" className="text-blue-400 hover:underline cursor-pointer">Go to Admin Settings</a> to test profile picture upload</p>
          </div>
        </div>
      </div>
    </div>
  );
}
