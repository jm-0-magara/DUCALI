import React from 'react';
import { ProfileSettings } from '../../components/ProfileSettings';

export default function ProfileUploadDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Picture Upload Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the profile picture upload functionality with drag & drop support
          </p>
        </div>
        
        <ProfileSettings />
      </div>
    </div>
  );
}
