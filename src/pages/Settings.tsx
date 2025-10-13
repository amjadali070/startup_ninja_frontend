import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileIdentityForm, { ProfileFormState } from '../components/settings/ProfileIdentityForm';
import IntegrationsList, { IntegrationOption } from '../components/settings/IntegrationsList';
import PlanSummaryCard, { PlanSummary } from '../components/settings/PlanSummaryCard';
import SupportCard from '../components/settings/SupportCard';
import SettingsHeader from '../components/settings/SettingsHeader';
import { useAuth } from '../hooks/useAuth.tsx';
import { authService } from '../services/auth';
import { userService, type UserProfile } from '../services/user';
import { resolveProfilePictureUrl } from '../utils/profile';


const defaultIntegrationOptions: IntegrationOption[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send AI insights, approvals, and publishing alerts directly to your workspace.',
    category: 'Collaboration',
    connected: true,
    badge: 'Recommended',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync documents, knowledge bases, and AI-generated drafts into Notion.',
    category: 'Docs & Knowledge',
    connected: false,
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Push brand assets and generate concept boards directly in your design system.',
    category: 'Design',
    connected: true,
    beta: true,
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Import briefs, store generated assets, and keep everything synced securely.',
    category: 'Cloud Storage',
    connected: false,
  },
];


const defaultPlanSummary: PlanSummary = {
  name: 'Pro Studio',
  renewalDate: 'Renews on Oct 12, 2024',
  status: 'active',
  tokensUsed: 182_450,
  tokensLimit: 250_000,
  creditsUsed: 76,
  creditsLimit: 120,
};

const Settings: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    username: '',
    email: '',
    company: '',
    jobTitle: '',
    location: '',
    timezone: 'UTC',
    bio: '',
  });

  const [profileBaseline, setProfileBaseline] = useState<ProfileFormState>({
    username: '',
    email: '',
    company: '',
    jobTitle: '',
    location: '',
    timezone: 'UTC',
    bio: '',
  });

  const [integrations, setIntegrations] = useState<IntegrationOption[]>(defaultIntegrationOptions);
  const [profileImageDraft, setProfileImageDraft] = useState<string | null>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const previousImageUrlRef = useRef<string | null>(null);

  const planSummary = defaultPlanSummary;

  const resolvedProfilePicture = useMemo(() => {
    if (profileImageDraft === '') {
      return null;
    }

    if (profileImageDraft) {
      return profileImageDraft;
    }

    const fallbackUser = authService.getUser?.() ?? null;
    const fallbackPicture = fallbackUser?.profilePicture ?? fallbackUser?.picture ?? null;
    return resolveProfilePictureUrl(profile?.profilePicture ?? fallbackPicture);
  }, [profile?.profilePicture, profileImageDraft]);

  useEffect(() => {
    const previousUrl = previousImageUrlRef.current;
    if (previousUrl && previousUrl !== profileImageDraft && previousUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previousUrl);
    }

    if (profileImageDraft && profileImageDraft !== '' && profileImageDraft.startsWith('blob:')) {
      previousImageUrlRef.current = profileImageDraft;
    } else if (profileImageDraft === '') {
      previousImageUrlRef.current = null;
    }
  }, [profileImageDraft]);

  useEffect(() => {
    return () => {
      const previousUrl = previousImageUrlRef.current;
      if (previousUrl && previousUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previousUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setLoading(false);
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (response.success && response.user) {
          setProfile(response.user);
          const hydratedForm: ProfileFormState = {
            username: response.user.username ?? '',
            email: response.user.email ?? '',
            company: '',
            jobTitle: '',
            location: '',
            timezone: 'UTC',
            bio: '',
          };
          setProfileForm(hydratedForm);
          setProfileBaseline(hydratedForm);
          setProfileImageDraft(null);
          setError(null);
        } else {
          if (response.message === 'User not found') {
            await logout();
            navigate('/login', { replace: true });
          }
          setError(response.message || 'Unable to load profile.');
        }
      } catch (err) {
        console.error('Settings profile fetch failed:', err);
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Settings logout failed:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  const handleProfileChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setProfileForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileReset = () => {
    setProfileForm(profileBaseline);
    setProfileImageDraft(null);
    toast.success('Profile changes reverted.');
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingProfile(true);

    try {
      const payload = {
        username: profileForm.username,
        email: profileForm.email,
      };

      const response = await userService.updateProfile(payload);
      if (response.success && response.user) {
        setProfile(response.user);
        const updatedForm: ProfileFormState = {
          ...profileForm,
          username: response.user.username ?? profileForm.username,
          email: response.user.email ?? profileForm.email,
        };
        setProfileForm(updatedForm);
        setProfileBaseline(updatedForm);
        toast.success('Profile updated successfully.');
      } else {
        toast.error(response.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      toast.error('Something went wrong while saving your profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProfileImageSelect = (file: File) => {
    setIsUpdatingAvatar(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      setProfileImageDraft(objectUrl);
      toast.success('Profile image updated. Save your profile to apply the change.');
    } catch (err) {
      console.error('Profile image selection failed:', err);
      toast.error('Unable to load the selected image.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleProfileImageRemove = () => {
    setProfileImageDraft('');
    toast.success('Profile image removed. Save your profile to confirm.');
  };

  const handleIntegrationAction = (integration: IntegrationOption) => {
    const nextConnected = !integration.connected;
    setIntegrations((prev) =>
      prev.map((item) => (item.id === integration.id ? { ...item, connected: nextConnected } : item))
    );
    toast.success(
      nextConnected
        ? `${integration.name} is now connected.`
        : `${integration.name} has been disconnected.`
    );
  };

  const handleViewBillingHistory = () => {
    toast('Billing history will be available soon.');
  };

  const handleUpgradePlan = () => {
    toast.success('A success specialist will reach out about upgrading your plan.');
  };

  const handleContactSupport = () => {
    toast.success('We just notified the support team. Expect a reply shortly.');
  };

  const createdAtDisplay = useMemo(() => {
    if (!profile?.createdAt) {
      return 'Recently joined';
    }

    try {
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(profile.createdAt));
    } catch (err) {
      console.error('Failed to format createdAt date:', err);
      return 'Recently joined';
    }
  }, [profile?.createdAt]);

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <div className="flex w-full min-h-screen bg-[#07070C] text-white">
      <DashboardSidebar activePath="/settings" />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar
          title="Settings"
          userName={profile?.username ?? 'Ninja'}
          profilePicture={resolvedProfilePicture ?? undefined}
          email={profile?.email}
          username={profile?.username}
          onLogout={handleLogout}
          onSettings={handleOpenSettings}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-full px-4 py-6 sm:px-6 lg:px-10">
            <div className="space-y-8">
              <SettingsHeader planSummary={planSummary} onUpgradePlan={handleUpgradePlan} />

              {error ? (
                <div className="rounded-3xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-8">
                  <ProfileIdentityForm
                    displayName={profile?.username || profileForm.username || 'Startup Ninja'}
                    createdAt={createdAtDisplay}
                    profileForm={profileForm}
                    isSaving={isSavingProfile}
                    onChange={handleProfileChange}
                    onSubmit={handleProfileSubmit}
                    onReset={handleProfileReset}
                    profileImageUrl={resolvedProfilePicture ?? undefined}
                    isUpdatingImage={isUpdatingAvatar}
                    onProfileImageSelect={handleProfileImageSelect}
                    onProfileImageRemove={resolvedProfilePicture ? handleProfileImageRemove : undefined}
                  />
                  <IntegrationsList integrations={integrations} onAction={handleIntegrationAction} />

                </div>

                <aside className="space-y-8">
                  <PlanSummaryCard plan={planSummary} onViewBillingHistory={handleViewBillingHistory} />
                  <SupportCard onContactSupport={handleContactSupport} />
                </aside>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;