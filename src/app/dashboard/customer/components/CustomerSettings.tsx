// src/app/dashboard/customer/components/CustomerSettings.tsx
import React from 'react';
import { User } from '../../../../types/auth';

interface CustomerSettingsProps {
  user: User;
}

export function CustomerSettings({ user }: CustomerSettingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={user.name}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                readOnly
              />
            </div>
            <button className="bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-[#A4B465]" defaultChecked />
              <span className="text-slate-300">Order updates</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-[#A4B465]" defaultChecked />
              <span className="text-slate-300">New messages</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-[#A4B465]" />
              <span className="text-slate-300">Marketing emails</span>
            </label>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Privacy & Security</h3>
          <div className="space-y-3">
            <button className="block text-left text-slate-300 hover:text-[#A4B465] transition-colors">
              Change Password
            </button>
            <button className="block text-left text-slate-300 hover:text-[#A4B465] transition-colors">
              Download My Data
            </button>
            <button className="block text-left text-red-400 hover:text-red-300 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}