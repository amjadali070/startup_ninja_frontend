import React, { useState } from 'react';
import {
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPlus,
  FaTrash,
  FaPaperPlane
} from 'react-icons/fa';
import { usePost } from './PostContext';
import { useAuth } from '../../hooks/useAuth';
import linkedinService from '../../services/linkedin';
import twitterService from '../../services/twitter';
import instagramService from '../../services/instagram';
import facebookService from '../../services/facebook';
import AlertModal from '../AlertModal';
import schedulerService from '../../services/scheduler';

type Platform = {
  id: 'facebook' | 'instagram' | 'x' | 'linkedin';
  name: string;
  IconComponent: React.ElementType;
  color: string;
};

const allPlatforms: Platform[] = [
  { id: 'facebook', name: 'Facebook', IconComponent: FaFacebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', IconComponent: FaInstagram, color: '#E4405F' },
  { id: 'x', name: 'X (Twitter)', IconComponent: FaTwitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', IconComponent: FaLinkedin, color: '#0A66C2' },
];

type ScheduledPlatform = {
  id: 'facebook' | 'instagram' | 'x' | 'linkedin';
  date: string;
  time: string;
};

const SchedulingOption: React.FC = () => {
  const { postData } = usePost();
  const { user } = useAuth();
  const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(true);
  const [isPlatformSelectorOpen, setIsPlatformSelectorOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const [scheduledPlatforms, setScheduledPlatforms] = useState<ScheduledPlatform[]>([
    // Default: empty list; user can add platforms
  ]);

  const buildLocalDate = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return new Date('');
    const [y, m, d] = String(dateStr).split('-').map(Number);
    const [hh, mm] = String(timeStr).split(':').map(Number);
    if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return new Date('');
    return new Date(y, m - 1, d, hh, mm, 0, 0);
  };

  const now = new Date();
  const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString()
    .split('T')[0];
  const nowHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  // currentHM and hasPastSelection not needed presently; min on date and validation handle this

  const showNotification = (title: string, message: string, type: 'success' | 'error') => {
    setNotification({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const handleScheduleChange = (platformId: string, field: 'date' | 'time', value: string) => {
    setScheduledPlatforms(currentPlatforms =>
      currentPlatforms.map(p => {
        if (p.id !== platformId) return p;
        if (field === 'date') {
          const newDate = value;
          let newTime = p.time;
          if (newDate === todayStr && newTime < nowHM) newTime = nowHM;
          return { ...p, date: newDate, time: newTime };
        }
        if (field === 'time') {
          let newTime = value;
          if (p.date === todayStr && newTime < nowHM) newTime = nowHM;
          return { ...p, time: newTime };
        }
        return p;
      })
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

  const handleSchedule = async () => {
    if (!postData.content && postData.files.length === 0) {
      showNotification('Error', 'Please add content or an image to your post', 'error');
      return;
    }

    // For scheduling, use platforms added in this component (not PlatformTags selection)
    const supportedPlatforms = ['linkedin', 'x', 'instagram', 'facebook'] as const;
    const platformsFromSchedule = Array.from(new Set(
      scheduledPlatforms
        .map(p => p.id)
        .filter((p): p is 'linkedin' | 'x' | 'instagram' | 'facebook' => (supportedPlatforms as readonly string[]).includes(p))
    ));

    if (platformsFromSchedule.length === 0) {
      showNotification('Error', 'Please add at least one platform in Scheduling Options to schedule', 'error');
      return;
    }

    // Validate that no selection is in the past
    const invalid = scheduledPlatforms.find(p => buildLocalDate(p.date, p.time).getTime() < Date.now());
    if (invalid) {
      showNotification('Error', 'Please choose a future date and time for all platforms', 'error');
      return;
    }

    // Use the first scheduled date/time entry as a single schedule time
    const first = scheduledPlatforms[0];
    if (!first?.date || !first?.time) {
      showNotification('Error', 'Please select a valid date and time', 'error');
      return;
    }

    try {
      setIsScheduling(true);

      const imageFile = postData.files.find(f => f.type === 'image')?.file || null;

      const resp = await schedulerService.schedulePost({
        caption: postData.content,
        platforms: platformsFromSchedule,
        schedules: scheduledPlatforms
          .filter(p => platformsFromSchedule.includes(p.id as any))
          .map(p => ({ platform: p.id as any, date: p.date, time: p.time })),
        imageFile,
      });

      if (resp.success) {
        showNotification('Scheduled', 'Your post has been scheduled for selected platforms.', 'success');
        try {
          window.dispatchEvent(new CustomEvent('scheduledPosts:refresh', { detail: {
            scheduledAt: `${first.date}T${first.time}:00`,
            platforms: platformsFromSchedule,
          }}));
        } catch (_) {}
      } else {
        showNotification('Error', resp.message || 'Failed to schedule post', 'error');
      }
    } catch (e: any) {
      showNotification('Error', e.message || 'Failed to schedule post', 'error');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', scheduledPlatforms);
  };

  const handlePublishNow = async () => {
    if (!postData.content && postData.files.length === 0) {
      showNotification('Error', 'Please add content or an image to your post', 'error');
      return;
    }

    const supportedPlatforms = ['linkedin', 'x', 'instagram', 'facebook'];
    const selectedSupportedPlatforms = postData.selectedPlatforms.filter(platform => 
      supportedPlatforms.includes(platform)
    );

    if (selectedSupportedPlatforms.length === 0) {
      showNotification('Error', 'Please select at least one platform (LinkedIn, Twitter, Instagram, or Facebook) to publish', 'error');
      return;
    }

    if (!user?.id) {
      showNotification('Error', 'User not authenticated', 'error');
      return;
    }

    try {
      setIsPublishing(true);

      // Create FormData for the API request
      const formData = new FormData();
      formData.append('caption', postData.content);

      // Add the first image file if available
      if (postData.files.length > 0) {
        const imageFile = postData.files.find(file => file.type === 'image');
        if (imageFile) {
          formData.append('image', imageFile.file);
        }
      }

      const results = [];
      const errors = [];

      // Post to LinkedIn if selected
      if (postData.selectedPlatforms.includes('linkedin')) {
        try {
          const linkedinResult = await linkedinService.postToLinkedIn(formData);
          if (linkedinResult.success) {
            results.push('LinkedIn');
          } else {
            errors.push(`LinkedIn: ${linkedinResult.message}`);
            if (linkedinResult.requiresReconnection) {
              errors[errors.length - 1] += ' Please reconnect your LinkedIn account.';
            }
          }
        } catch (error: any) {
          errors.push(`LinkedIn: ${error.message || 'Failed to publish'}`);
        }
      }

      // Post to Twitter if selected
      if (postData.selectedPlatforms.includes('x')) {
        try {
          const twitterResult = await twitterService.postToTwitter(formData);
          if (twitterResult.success) {
            results.push('Twitter');
          } else {
            errors.push(`Twitter: ${twitterResult.message}`);
          }
        } catch (error: any) {
          errors.push(`Twitter: ${error.message || 'Failed to publish'}`);
        }
      }

      // Post to Instagram if selected
      if (postData.selectedPlatforms.includes('instagram')) {
        try {
          const instagramResult = await instagramService.postToInstagram(formData);
          if (instagramResult.success) {
            results.push('Instagram');
          } else {
            errors.push(`Instagram: ${instagramResult.message}`);
          }
        } catch (error: any) {
          errors.push(`Instagram: ${error.message || 'Failed to publish'}`);
        }
      }

      // Post to Facebook if selected
      if (postData.selectedPlatforms.includes('facebook')) {
        try {
          const facebookResult = await facebookService.postToFacebook(formData);
          if (facebookResult.success) {
            results.push('Facebook');
          } else {
            errors.push(`Facebook: ${facebookResult.message}`);
          }
        } catch (error: any) {
          errors.push(`Facebook: ${error.message || 'Failed to publish'}`);
        }
      }

      // Show appropriate notification based on results
      if (results.length > 0 && errors.length === 0) {
        // All platforms succeeded
        const platformList = results.join(' and ');
        showNotification(
          'Success!', 
          `Your post has been published to ${platformList} successfully!`, 
          'success'
        );
      } else if (results.length > 0 && errors.length > 0) {
        // Some platforms succeeded, some failed
        const successPlatforms = results.join(' and ');
        const errorMessages = errors.join('\n');
        showNotification(
          'Partial Success', 
          `Published to ${successPlatforms} successfully. Errors:\n${errorMessages}`, 
          'error'
        );
      } else {
        // All platforms failed
        const errorMessages = errors.join('\n');
        showNotification(
          'Publishing Failed', 
          `Failed to publish to any platform:\n${errorMessages}`, 
          'error'
        );
      }
      
      // Clear the post data after successful posting (if at least one succeeded)
      // You might want to implement a clear function in PostContext
      
    } catch (error: any) {
      console.error('Publishing error:', error);
      showNotification(
        'Error',
        error.message || 'Failed to publish posts',
        'error'
      );
    } finally {
      setIsPublishing(false);
    }
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
                    min={todayStr}
                    className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg pl-3 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert min-h-[44px]"
                  />
                </div>
                
                <div className="relative">
                  <input
                    type="time"
                    value={platformSchedule.time}
                    onChange={(e) => handleScheduleChange(platformSchedule.id, 'time', e.target.value)}
                    disabled={!isSchedulingEnabled}
                    min={platformSchedule.date === todayStr ? nowHM : '00:00'}
                    className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg pl-3 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert min-h-[44px]"
                  />
                  {/* Helper: warn if past */}
                  {buildLocalDate(platformSchedule.date, platformSchedule.time).getTime() < Date.now() && (
                    <div className="mt-1 ml-1 text-xs text-red-400">Time must be in the future</div>
                  )}
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
        {/* Publish Now Button */}
        <button
          onClick={handlePublishNow}
          disabled={isPublishing || (!postData.content && postData.files.length === 0)}
          className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 min-h-[44px] w-full md:w-auto"
        >
          {isPublishing ? (
            <>
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <FaPaperPlane className="w-4 h-4" />
              <span>Publish Now</span>
            </>
          )}
        </button>

        <button
          onClick={handleSchedule}
          disabled={isScheduling || !isSchedulingEnabled || scheduledPlatforms.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 min-h-[44px] w-full md:w-auto"
        >
          <FaCalendarAlt className="w-4 h-4" />
          <span>{isScheduling ? 'Scheduling...' : 'Schedule'}</span>
        </button>

        <button
          onClick={handleSaveAsDraft}
          className="inline-flex items-center justify-center bg-transparent border border-gray-600 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 min-h-[44px] w-full md:w-auto"
        >
          <span>Save as draft</span>
        </button>
      </div>

      <AlertModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default SchedulingOption;