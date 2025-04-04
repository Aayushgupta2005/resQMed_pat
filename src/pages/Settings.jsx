import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Monitor, Moon, Sun, Key, Fingerprint } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    appointments: true,
    updates: false,
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 text-center">Settings</h1>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200 p-6">
        {/* Profile Settings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="Full Name" className="pl-10 pr-4 py-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input type="email" placeholder="Email Address" className="pl-10 pr-4 py-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input type="password" placeholder="New Password" className="pl-10 pr-4 py-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="relative">
              <Key className="absolute left-3 top-3 text-gray-400" />
              <input type="password" placeholder="Confirm New Password" className="pl-10 pr-4 py-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500" />
            </div>

          </div>
        </div>

        {/* Notification Settings */}
        <div className="pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`${value ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200`}
                >
                  <span className={`${value ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`} />
                </button>
              </div>
            ))}
          </div>
        </div>

      

        {/* Save Changes Button */}
        <div className="pt-6">
          <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
