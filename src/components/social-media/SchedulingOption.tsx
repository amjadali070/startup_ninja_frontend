import React, { useState } from 'react';
import {
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPlus,
  FaTrash
} from 'react-icons/fa';

type Platform = {
  id: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  name: string;
  IconComponent: React.ElementType;
  color: string;
};

const allPlatforms: Platform[] = [
  { id: 'facebook', name: 'Facebook', IconComponent: FaFacebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', IconComponent: FaInstagram, color: '#E4405F' },
  { id: 'twitter', name: 'Twitter', IconComponent: FaTwitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', IconComponent: FaLinkedin, color: '#0A66C2' },
];

type ScheduledPlatform = {
  id: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  date: string;
  time: string;
};

const SchedulingOption: React.FC = () => {
  const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(true);
  const [isPlatformSelectorOpen, setIsPlatformSelectorOpen] = useState(false);

  const [scheduledPlatforms, setScheduledPlatforms] = useState<ScheduledPlatform[]>([
    { id: 'facebook', date: '2025-10-03', time: '13:35' },
    { id: 'instagram', date: '2025-10-12', time: '13:35' },
  ]);

  const handleScheduleChange = (platformId: string, field: 'date' | 'time', value: string) => {
    setScheduledPlatforms(currentPlatforms =>
      currentPlatforms.map(p =>
        p.id === platformId ? { ...p, [field]: value } : p
      )
    );
  };

  const addPlatform = (platformToAdd: Platform) => {
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0];
    const defaultTime = now.toTimeString().split(' ')[0].substring(0, 5); 

    setScheduledPlatforms(current => [
      ...current,
      { id: platformToAdd.id, date: defaultDate, time: defaultTime }
    ]);
    setIsPlatformSelectorOpen(false);
  };
  
  const removePlatform = (platformIdToRemove: string) => {
    setScheduledPlatforms(current =>
      current.filter(p => p.id !== platformIdToRemove)
    );
  };

  const handleSchedule = () => {
    console.log('Scheduling posts for:', scheduledPlatforms);
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', scheduledPlatforms);
  };

  const scheduledPlatformIds = new Set(scheduledPlatforms.map(p => p.id));
  const availablePlatforms = allPlatforms.filter(p => !scheduledPlatformIds.has(p.id));

  return (
    <div className="w-full rounded-2xl p-4 lg:p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <h2 className="text-white text-lg md:text-xl font-bold font-plus-jakarta">
          Scheduling Options
        </h2>
        
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-medium">Enable scheduling</span>
          <button
            onClick={() => setIsSchedulingEnabled(!isSchedulingEnabled)}
            aria-label="Toggle scheduling"
            title="Toggle scheduling"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              isSchedulingEnabled ? 'bg-red-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                isSchedulingEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-6">
        {scheduledPlatforms.map(platformSchedule => {
          const platformDetails = allPlatforms.find(p => p.id === platformSchedule.id);
          if (!platformDetails) return null;

          const { IconComponent, name, color } = platformDetails;

          return (
            <div key={platformSchedule.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5" style={{ color }} />
                  <span className="text-white text-sm font-medium">{name}</span>
                </div>
                <button
                  onClick={() => removePlatform(platformSchedule.id)}
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label={`Remove ${name} schedule`}
                  title={`Remove ${name}`}
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="relative">
                  <input
                    type="date"
                    value={platformSchedule.date}
                    onChange={(e) => handleScheduleChange(platformSchedule.id, 'date', e.target.value)}
                    disabled={!isSchedulingEnabled}
                    className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg pl-3 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert min-h-[44px]"
                  />
                </div>
                
                <div className="relative">
                  <input
                    type="time"
                    value={platformSchedule.time}
                    onChange={(e) => handleScheduleChange(platformSchedule.id, 'time', e.target.value)}
                    disabled={!isSchedulingEnabled}
                    className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg pl-3 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {availablePlatforms.length > 0 && (
        <div className="relative mb-8">
          <button
            onClick={() => setIsPlatformSelectorOpen(!isPlatformSelectorOpen)}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 border border-dashed rounded-lg border-gray-600 hover:bg-gray-800"
          >
            <FaPlus />
            Add Platform
          </button>

          {isPlatformSelectorOpen && (
            <div className="absolute z-10 w-full mt-2 bg-[#1E1E1E] border border-gray-700 rounded-lg shadow-lg">
              <ul className="p-1">
                {availablePlatforms.map(platform => (
                  <li
                    key={platform.id}
                    onClick={() => addPlatform(platform)}
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700"
                  >
                    <platform.IconComponent className="w-5 h-5" style={{ color: platform.color }} />
                    <span className="text-white text-sm">{platform.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={handleSchedule}
          disabled={!isSchedulingEnabled || scheduledPlatforms.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 min-h-[44px] w-full md:w-auto"
        >
          <FaCalendarAlt className="w-4 h-4" />
          <span>Schedule</span>
        </button>
        <button
          onClick={handleSaveAsDraft}
          className="inline-flex items-center justify-center bg-transparent border border-gray-600 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 min-h-[44px] w-full md:w-auto"
        >
          <span>Save as draft</span>
        </button>
      </div>
    </div>
  );
};

export default SchedulingOption;