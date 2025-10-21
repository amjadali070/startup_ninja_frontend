import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileIdentityForm, { ProfileFormState } from '../components/settings/ProfileIdentityForm';
import AccountSecurityForm, { SecurityFormState } from '../components/settings/AccountSecurityForm';
import LanguageRegionForm, { LanguageRegionFormState } from '../components/settings/LanguageRegionForm';
import PaymentMethodCard, { PaymentMethod } from '../components/settings/PaymentMethodCard';
import DeleteAccountForm from '../components/settings/DeleteAccountForm';
import CurrentPlanCard, { PlanDetails } from '../components/settings/CurrentPlanCard';
import SettingsHeader from '../components/settings/SettingsHeader';
import { useAuth } from '../hooks/useAuth.tsx';
import { authService } from '../services/auth';
import { userService, type UserProfile } from '../services/user';
import { resolveProfilePictureUrl } from '../utils/profile';

const defaultPlanDetails: PlanDetails = {
  name: 'Skilled Ninja',
  price: '$49/month',
  status: 'active',
  renewalDate: 'Renews on 15 Nov 2025',
  tokensUsed: 192_450,
  tokensLimit: 250_000,
  tokensRemaining: 57_550,
};

const defaultPaymentMethod: PaymentMethod = {
  id: '1',
  cardNumber: '4242424242424242',
  expiryDate: '12/25',
  cardType: 'mastercard',
  bankName: 'Mezzan Bank',
  cardholderName: 'ABD MALIK',
  isDefault: true,
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

  const [securityForm, setSecurityForm] = useState<SecurityFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [languageRegionForm, setLanguageRegionForm] = useState<LanguageRegionFormState>({
    language: 'English',
    timezone: 'PST (Pacific Standard Time)',
    dateFormat: 'MM/DD/YY',
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingLanguageRegion, setIsSavingLanguageRegion] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [profileImageDraft, setProfileImageDraft] = useState<string | null>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const previousImageUrlRef = useRef<string | null>(null);

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

  const handleSecurityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSecurityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSecuritySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdatingPassword(true);

    try {
      // Validate passwords match
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        toast.error('New passwords do not match.');
        return;
      }

      // Validate password strength
      if (securityForm.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters long.');
        return;
      }

      // Here you would typically call an API to update the password
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password updated successfully.');
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Password update failed:', err);
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSecurityReset = () => {
    setSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    toast.success('Security form reset.');
  };

  const handleLanguageRegionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setLanguageRegionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageRegionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingLanguageRegion(true);

    try {
      // Here you would typically call an API to update language and region settings
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Language and region settings updated successfully.');
    } catch (err) {
      console.error('Language region update failed:', err);
      toast.error('Failed to update language and region settings. Please try again.');
    } finally {
      setIsSavingLanguageRegion(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);

    try {
      // Here you would typically call an API to delete the account
      // For now, we'll just simulate the deletion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Account deleted successfully.');
      
      // Logout and redirect after successful deletion
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Account deletion failed:', err);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleViewBillingHistory = () => {
    toast('Billing history will be available soon.');
  };

  const handleCancelSubscription = () => {
    toast('Subscription cancellation will be available soon.');
  };

  const handleUpgradePlan = () => {
    toast.success('A success specialist will reach out about upgrading your plan.');
  };

  const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
    console.log('Editing payment method:', paymentMethod.id);
    toast('Payment method editing will be available soon.');
  };

  const handleAddPaymentMethod = () => {
    toast('Add payment method functionality will be available soon.');
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
    <DashboardLayout 
      activePath="/settings" 
      title="Settings"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-full px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 xs:py-5 sm:py-6 md:py-8">
          <div className="space-y-8">
            <SettingsHeader/>

            {error ? (
              <div className="rounded-3xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6">
              <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6">
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
                <AccountSecurityForm
                  securityForm={securityForm}
                  isUpdating={isUpdatingPassword}
                  onChange={handleSecurityChange}
                  onSubmit={handleSecuritySubmit}
                  onReset={handleSecurityReset}
                />
                <DeleteAccountForm
                  onDeleteAccount={handleDeleteAccount}
                  isDeleting={isDeletingAccount}
                />
              </div>

              <aside className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6">
                <CurrentPlanCard
                  plan={defaultPlanDetails}
                  onUpgradePlan={handleUpgradePlan}
                  onViewBillingHistory={handleViewBillingHistory}
                  onCancelSubscription={handleCancelSubscription}
                />
                <PaymentMethodCard
                  paymentMethod={defaultPaymentMethod}
                  onEdit={handleEditPaymentMethod}
                  onAddPaymentMethod={handleAddPaymentMethod}
                />
                <LanguageRegionForm
                  form={languageRegionForm}
                  isSaving={isSavingLanguageRegion}
                  onChange={handleLanguageRegionChange}
                  onSubmit={handleLanguageRegionSubmit}
                />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Settings;