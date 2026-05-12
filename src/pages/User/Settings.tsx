// Build: 2025-12-31 - Fixed TypeScript compilation errors
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import ProfileIdentityForm, {
  ProfileFormState,
} from "../../components/settings/ProfileIdentityForm.tsx";
import ChangePassword, {
  ChangePasswordFormState,
} from "../../components/settings/ChangePassword.tsx";
import LanguageRegionForm, {
  LanguageRegionFormState,
} from "../../components/settings/LanguageRegionForm.tsx";
import PaymentMethodCard from "../../components/settings/PaymentMethodCard.tsx";
import DeleteAccountForm from "../../components/settings/DeleteAccountForm.tsx";
import CurrentPlanCard from "../../components/settings/CurrentPlanCard.tsx";
import PlansOverview from "../../components/settings/PlansOverview.tsx";
import PlanSelectionModal from "../../components/settings/PlanSelectionModal.tsx";
import UpgradePlanModal from "../../components/settings/UpgradePlanModal.tsx";

import { useAuth } from "../../hooks/useAuth.tsx";
import { authService } from "../../services/auth.ts";
import { subscriptionService } from "../../services/subscription.ts";
import {
  userService,
  type UserProfile,
} from "../../services/user.ts";
import { planService, Plan } from "../../services/plan.ts";
import { resolveProfilePictureUrl } from "../../utils/profile.ts";

interface SubscriptionData {
  plan: string;
  status: 'active' | 'inactive' | 'cancelled';
  nextBillingDate?: string;
  usage?: {
    ai_chat_messages: number;
    generated_images: number;
    social_posts: number;
    websites: number;
    legal_contracts: number;
    legal_contract_section_revisions: number;
    team_members: number;
  };
  limits?: {
    ai_chat_messages: number;
    generated_images: number;
    social_posts: number;
    websites: number;
    legal_contracts: number;
    legal_contract_section_revisions: number;
    team_members: number;
  };
}

const Settings: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Modal states
  const [showPlanSelectionModal, setShowPlanSelectionModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    username: "",
    email: "",
    company: "",
    jobTitle: "",
    location: "",
    timezone: "UTC",
    bio: "",
  });

  const [profileBaseline, setProfileBaseline] = useState<ProfileFormState>({
    username: "",
    email: "",
    company: "",
    jobTitle: "",
    location: "",
    timezone: "UTC",
    bio: "",
  });

  const [changePasswordForm, setChangePasswordForm] =
    useState<ChangePasswordFormState>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [languageRegionForm, setLanguageRegionForm] =
    useState<LanguageRegionFormState>({
      language: "English",
      timezone: "PST (Pacific Standard Time)",
      dateFormat: "MM/DD/YY",
    });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingLanguageRegion, setIsSavingLanguageRegion] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [profileImageDraft, setProfileImageDraft] = useState<string | null>(
    null
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const previousImageUrlRef = useRef<string | null>(null);

  const resolvedProfilePicture = useMemo(() => {
    if (profileImageDraft === "") {
      return null;
    }

    if (profileImageDraft) {
      return profileImageDraft;
    }

    const fallbackUser = authService.getUser?.() ?? null;
    const fallbackPicture =
      fallbackUser?.profilePicture ?? fallbackUser?.picture ?? null;
    return resolveProfilePictureUrl(profile?.profilePicture ?? fallbackPicture);
  }, [profile?.profilePicture, profileImageDraft]);

  useEffect(() => {
    const previousUrl = previousImageUrlRef.current;
    if (
      previousUrl &&
      previousUrl !== profileImageDraft &&
      previousUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previousUrl);
    }

    if (
      profileImageDraft &&
      profileImageDraft !== "" &&
      profileImageDraft.startsWith("blob:")
    ) {
      previousImageUrlRef.current = profileImageDraft;
    } else if (profileImageDraft === "") {
      previousImageUrlRef.current = null;
    }
  }, [profileImageDraft]);

  useEffect(() => {
    return () => {
      const previousUrl = previousImageUrlRef.current;
      if (previousUrl && previousUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previousUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, preferencesRes, subscriptionRes, plansRes] = await Promise.all(
          [
            userService.getProfile(),
            userService.getPreferences(),
            subscriptionService.getSubscription(),
            planService.getAllPlans(),
          ]
        );

        if (profileRes.success && profileRes.user) {
          setProfile(profileRes.user);
          const hydratedForm: ProfileFormState = {
            username: profileRes.user.username ?? "",
            email: profileRes.user.email ?? "",
            company: "",
            jobTitle: "",
            location: "",
            timezone: "UTC",
            bio: "",
          };
          setProfileForm(hydratedForm);
          setProfileBaseline(hydratedForm);
          setProfileImageDraft(null);
          setError(null);
        } else {
          if (profileRes.message === "User not found") {
            await logout();
            navigate("/login", { replace: true });
          }
          setError(profileRes.message || "Unable to load profile.");
        }

        if (subscriptionRes.success && subscriptionRes.data) {
             setSubscription(subscriptionRes.data as SubscriptionData);
        }

        if (plansRes.success && plansRes.data) {
             setPlans(plansRes.data);
        }

        if (preferencesRes.success && preferencesRes.data) {
          setLanguageRegionForm({
            language: preferencesRes.data.language,
            timezone: preferencesRes.data.timezone,
            dateFormat: preferencesRes.data.dateFormat,
          });
        }
      } catch (err) {
        console.error("Settings data fetch failed:", err);
        setError("Unable to load settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logout, navigate]);

  const refreshSubscription = async () => {
    try {
      const subscriptionRes = await subscriptionService.getSubscription();
      if (subscriptionRes.success && subscriptionRes.data) {
        setSubscription(subscriptionRes.data as SubscriptionData);
      }
    } catch (err) {
      console.error("Failed to refresh subscription:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Settings logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const handleProfileChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    setSelectedImageFile(null);
    toast.success("Profile changes reverted.");
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingProfile(true);

    try {
      let payload: any;
      
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append('username', profileForm.username);
        formData.append('email', profileForm.email);
        formData.append('profilePicture', selectedImageFile);
        payload = formData;
      } else {
        payload = {
          username: profileForm.username,
          email: profileForm.email,
        };
      }

      const response = await userService.updateProfile(payload);
      if (response.success && response.user) {
        setProfile(response.user);
        setSelectedImageFile(null); // Clear selected file after success
        const updatedForm: ProfileFormState = {
          ...profileForm,
          username: response.user.username ?? profileForm.username,
          email: response.user.email ?? profileForm.email,
        };
        setProfileForm(updatedForm);
        setProfileBaseline(updatedForm);
        toast.success("Profile updated successfully.");
      } else {
        toast.error(response.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Something went wrong while saving your profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProfileImageSelect = (file: File) => {
    setIsUpdatingAvatar(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      setProfileImageDraft(objectUrl);
      setSelectedImageFile(file);
      toast.success(
        "Profile image updated. Save your profile to apply the change."
      );
    } catch (err) {
      console.error("Profile image selection failed:", err);
      toast.error("Unable to load the selected image.");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleProfileImageRemove = () => {
    setProfileImageDraft("");
    setSelectedImageFile(null);
    toast.success("Profile image removed. Save your profile to confirm.");
  };

  const handleChangePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setChangePasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsUpdatingPassword(true);

    try {
      // Validate passwords match
      if (
        changePasswordForm.newPassword !== changePasswordForm.confirmPassword
      ) {
        toast.error("New passwords do not match.");
        return;
      }

      // Validate password strength
      if (changePasswordForm.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        return;
      }

      // Call the API to update the password
      const response = await authService.changePassword({
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword,
      });

      if (response.success) {
        toast.success("Password updated successfully.");
        setChangePasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.message || "Failed to update password.");
      }
    } catch (err: any) {
      console.error("Password update failed:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleChangePasswordReset = () => {
    setChangePasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast.success("Password form reset.");
  };

  const handleLanguageRegionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setLanguageRegionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageRegionSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSavingLanguageRegion(true);

    try {
      const response = await userService.updatePreferences({
        language: languageRegionForm.language,
        timezone: languageRegionForm.timezone,
        dateFormat: languageRegionForm.dateFormat,
      });

      if (response.success) {
        toast.success("Language and region settings updated successfully.");
      } else {
        toast.error(response.message || "Failed to update preferences.");
      }
    } catch (err) {
      console.error("Language region update failed:", err);
      toast.error(
        "Failed to update language and region settings. Please try again."
      );
    } finally {
      setIsSavingLanguageRegion(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);

    try {
      const response = await userService.deleteAccount();

      if (response.success) {
        toast.success("Account deleted successfully.");

        // Logout and redirect after successful deletion
        await logout();
        navigate("/login", { replace: true });
      } else {
        toast.error(response.message || "Failed to delete account.");
      }
    } catch (err) {
      console.error("Account deletion failed:", err);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleViewBillingHistory = () => {
    navigate('/billing-history');
  };

  const handleCancelSubscription = async () => {
        const loadingId = toast.loading("Processing cancellation...");
        try {
            const response = await subscriptionService.cancelSubscription();
            if (response.success) {
                toast.success("Subscription cancelled successfully.", { id: loadingId });
                refreshSubscription();
            } else {
                toast.error(response.message || "Failed to cancel subscription", { id: loadingId });
            }
        } catch (error) {
            toast.error("An error occurred during cancellation", { id: loadingId });
        }
  };

  const handleUpgradePlan = () => {
    // Show plan selection modal first
    setShowPlanSelectionModal(true);
  };

  const handlePlanSelected = (planName: string) => {
    // Close plan selection modal and open upgrade modal with selected plan
    setShowPlanSelectionModal(false);
    setSelectedPlan(planName);
    setShowUpgradeModal(true);
  };

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setShowUpgradeModal(true);
  };

  const createdAtDisplay = useMemo(() => {
    if (!profile?.createdAt) {
      return "Recently joined";
    }

    try {
      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(profile.createdAt));
    } catch (err) {
      console.error("Failed to format createdAt date:", err);
      return "Recently joined";
    }
  }, [profile?.createdAt]);

  const handleRequestPasswordReset = async () => {
    if (!profile?.email) {
        toast.error("Email address not found in profile.");
        return;
    }
    const loadingId = toast.loading("Sending password reset email...");
    try {
        const response = await authService.forgotPassword(profile.email);
        if (response.success) {
            toast.success("Reset link sent! Please check your email inbox (and spam).", { id: loadingId });
        } else {
            toast.error(response.message || "Failed to send reset email.", { id: loadingId });
        }
    } catch (err: any) {
        console.error("Forgot password API failed:", err);
        toast.error("An error occurred while sending the reset email.", { id: loadingId });
    }
  };

  // Cast prop as any if needed to avoid TS strict check during refactor
  const currentPlanProps: any = {
      subscription,
      plans,
      onUpgradePlan: handleUpgradePlan,
      onViewBillingHistory: handleViewBillingHistory,
      onCancelSubscription: handleCancelSubscription
  };

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <DashboardLayout
      activePath="/settings"
      title="Account & workspace settings"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-full px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 xs:py-5 sm:py-6 md:py-8">
          <div className="space-y-6">
            {error ? (
              <div className="rounded-3xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6">
              <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6">
                <ProfileIdentityForm
                  displayName={
                    profile?.username || profileForm.username || "Startup Ninja"
                  }
                  createdAt={createdAtDisplay}
                  profileForm={profileForm}
                  isSaving={isSavingProfile}
                  onChange={handleProfileChange}
                  onSubmit={handleProfileSubmit}
                  onReset={handleProfileReset}
                  profileImageUrl={resolvedProfilePicture ?? undefined}
                  isUpdatingImage={isUpdatingAvatar}
                  onProfileImageSelect={handleProfileImageSelect}
                  onProfileImageRemove={
                    resolvedProfilePicture
                      ? handleProfileImageRemove
                      : undefined
                  }
                />

                  <ChangePassword
                  form={changePasswordForm}
                  isUpdating={isUpdatingPassword}
                  onChange={handleChangePasswordChange}
                  onSubmit={handleChangePasswordSubmit}
                  onReset={handleChangePasswordReset}
                  onLogout={async () => { await logout(); }}
                  onRequestReset={handleRequestPasswordReset}
                />
                <DeleteAccountForm
                  onDeleteAccount={handleDeleteAccount}
                  isDeleting={isDeletingAccount}
                />
              </div>

              <aside className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6">
                <CurrentPlanCard {...currentPlanProps} />
                <PaymentMethodCard onRefresh={refreshSubscription} />
                <LanguageRegionForm
                  form={languageRegionForm}
                  isSaving={isSavingLanguageRegion}
                  onChange={handleLanguageRegionChange}
                  onSubmit={handleLanguageRegionSubmit}
                />
              </aside>
            </div>

            {/* Plans Overview Section */}
            <PlansOverview 
                currentPlan={subscription?.plan || 'Free'} 
                onSelectPlan={handleSelectPlan} 
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <PlanSelectionModal
        isOpen={showPlanSelectionModal}
        onClose={() => setShowPlanSelectionModal(false)}
        currentPlan={subscription?.plan || 'Free'}
        onSelectPlan={handlePlanSelected}
      />

      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onBack={() => {
          setShowUpgradeModal(false);
          setShowPlanSelectionModal(true);
        }}
        planName={selectedPlan}
        onSuccess={() => {
          refreshSubscription();
        }}
      />


    </DashboardLayout>
  );
};

export default Settings;
