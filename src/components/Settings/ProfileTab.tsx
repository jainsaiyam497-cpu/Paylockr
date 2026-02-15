import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, FileText, Save, Loader2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { Button } from '../common/Button';

export const ProfileTab: React.FC = () => {
  // Mock initial state
  const [profile, setProfile] = useState<UserProfile>({
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    gstNumber: '22AAAAA0000A1Z5',
    panNumber: 'ABCDE1234F',
    address: '123 Freelance Street, Startup Hub, Bangalore, Karnataka - 560001'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Ideally show toast here
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 pb-6 border-b dark:border-slate-800">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-3xl">
          {profile.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">{profile.name}</h3>
          <p className="text-slate-500">Freelancer • {profile.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
            <User size={16} /> Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
            <Mail size={16} /> Email (Read-only)
          </label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full p-3 rounded-lg border bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
            <Phone size={16} /> Phone Number
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
            <FileText size={16} /> GST Number
          </label>
          <input
            type="text"
            value={profile.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            placeholder="Optional"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
            <CreditCard size={16} /> PAN Number
          </label>
          <input
            type="text"
            value={profile.panNumber}
            onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            placeholder="Optional"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
            <MapPin size={16} /> Billing Address
          </label>
          <textarea
            value={profile.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t dark:border-slate-800">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          className="flex items-center gap-2"
        >
          {!isSaving && <Save size={18} />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};