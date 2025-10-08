import React, { useState } from 'react';
import { FaCalendarAlt, FaFacebook, FaInstagram } from 'react-icons/fa';

const SchedulingOption: React.FC = () => {
  const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(true);
  const [facebookDate, setFacebookDate] = useState('2025-10-03');
  const [facebookTime, setFacebookTime] = useState('13:35');
  const [instagramDate, setInstagramDate] = useState('2025-10-12');
  const [instagramTime, setInstagramTime] = useState('13:35');

  const handleSchedule = () => {
    console.log('Schedule posts');
  };

  const handleSaveAsDraft = () => {
    console.log('Save as draft');
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full bg-[#121212] rounded-2xl p-4 lg:p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
        <h2 className="text-white text-lg md:text-xl font-bold font-plus-jakarta">
          Scheduling Option
        </h2>
        
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-medium">Set date and time</span>
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

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFacebook className="w-5 h-5 text-[#1877F2]" />
          <span className="text-white text-sm font-medium">Facebook</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="relative">
            <input
              type="date"
              value={facebookDate}
              onChange={(e) => setFacebookDate(e.target.value)}
              disabled={!isSchedulingEnabled}
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg px-3 py-3 md:py-2.5 text-white text-sm md:text-base
                         focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
                         [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert
                         min-h-[44px]"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <input
              type="time"
              value={facebookTime}
              onChange={(e) => setFacebookTime(e.target.value)}
              disabled={!isSchedulingEnabled}
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg px-3 py-3 md:py-2.5 text-white text-sm md:text-base
                         focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
                         [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert
                         min-h-[44px]"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FaInstagram className="w-5 h-5 text-[#E4405F]" />
          <span className="text-white text-sm font-medium">Instagram</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="relative">
            <input
              type="date"
              value={instagramDate}
              onChange={(e) => setInstagramDate(e.target.value)}
              disabled={!isSchedulingEnabled}
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg px-3 py-3 md:py-2.5 text-white text-sm md:text-base
                         focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
                         [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert
                         min-h-[44px]"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <input
              type="time"
              value={instagramTime}
              onChange={(e) => setInstagramTime(e.target.value)}
              disabled={!isSchedulingEnabled}
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg px-3 py-3 md:py-2.5 text-white text-sm md:text-base
                         focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
                         [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert
                         min-h-[44px]"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={handleSchedule}
          disabled={!isSchedulingEnabled}
          className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 
                     disabled:bg-gray-600 disabled:cursor-not-allowed
                     text-white px-4 py-3 md:px-5 md:py-2.5 rounded-lg text-sm md:text-base font-medium 
                     transition-colors duration-200 min-h-[44px] w-full md:w-auto"
        >
          <FaCalendarAlt className="w-4 h-4" />
          <span>Schedule</span>
        </button>

        <button
          onClick={handleSaveAsDraft}
          className="inline-flex items-center justify-center gap-2 bg-transparent border border-gray-600 
                     hover:bg-gray-800 text-white px-4 py-3 md:px-5 md:py-2.5 rounded-lg text-sm md:text-base font-medium 
                     transition-colors duration-200 min-h-[44px] w-full md:w-auto"
        >
          <span>Save as draft</span>
        </button>
      </div>
    </div>
  );
};

export default SchedulingOption;