import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { userService, BusinessProfile } from '../services/user';

interface BusinessProfileContextType {
  profile: BusinessProfile | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
  // True once we've actually asked the backend and the account owner has
  // neither finished nor explicitly skipped onboarding yet.
  needsOnboarding: boolean;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | undefined>(undefined);

export const BusinessProfileProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only the account owner (not a team member added by someone else, not admin)
  // has a business to onboard — everyone else skips this entirely.
  const isOwnerAccount = isAuthenticated && user?.role !== 'admin' && !user?.addedBy;

  const refetchProfile = useCallback(async () => {
    if (!isOwnerAccount) return;
    setLoading(true);
    try {
      const res = await userService.getBusinessProfile();
      if (res.success) {
        setProfile(res.data ?? null);
        setFetched(true);
      }
      // On failure (a transient error, or a request that raced a token
      // refresh and lost), deliberately leave `fetched` false rather than
      // treating "we don't know" as "user hasn't onboarded" — that
      // previously bounced already-onboarded users to /onboarding whenever
      // this one request failed for any reason, unrelated to their real
      // onboarding status. `needsOnboarding` only turns true once a fetch
      // has genuinely succeeded and confirmed it.
    } finally {
      setLoading(false);
    }
  }, [isOwnerAccount]);

  useEffect(() => {
    if (isOwnerAccount && !fetched) {
      refetchProfile();
    }
    if (!isAuthenticated) {
      setProfile(null);
      setFetched(false);
    }
  }, [isOwnerAccount, fetched, isAuthenticated, refetchProfile]);

  const needsOnboarding =
    isOwnerAccount && fetched && !profile?.completedOnboarding && !profile?.skippedOnboarding;

  return (
    <BusinessProfileContext.Provider value={{ profile, loading, refetchProfile, needsOnboarding: !!needsOnboarding }}>
      {children}
    </BusinessProfileContext.Provider>
  );
};

export const useBusinessProfile = () => {
  const context = useContext(BusinessProfileContext);
  if (!context) {
    throw new Error('useBusinessProfile must be used within a BusinessProfileProvider');
  }
  return context;
};
