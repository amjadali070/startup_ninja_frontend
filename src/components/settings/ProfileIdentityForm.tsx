import { useRef, type ChangeEvent, type FC, type FormEvent } from 'react';
const panelCardClass =
  'rounded-3xl border border-white/10 bg-[#0E0E18] p-6 sm:p-7 lg:p-8 shadow-[0_20px_45px_rgba(6,7,12,0.55)]';
const sectionHeadingClass = 'font-plus-jakarta text-lg font-semibold text-white sm:text-xl';

export type ProfileFormState = {
  username: string;
  email: string;
  company: string;
  jobTitle: string;
  location: string;
  timezone: string;
  bio: string;
};

interface ProfileIdentityFormProps {
  displayName: string;
  createdAt: string;
  profileForm: ProfileFormState;
  isSaving: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  profileImageUrl?: string | null;
  isUpdatingImage?: boolean;
  onProfileImageSelect: (file: File) => void;
  onProfileImageRemove?: () => void;
}

const ProfileIdentityForm: FC<ProfileIdentityFormProps> = ({
  displayName,
  createdAt,
  profileForm,
  isSaving,
  onChange,
  onSubmit,
  onReset,
  profileImageUrl,
  isUpdatingImage = false,
  onProfileImageSelect,
  onProfileImageRemove,
}) => {
  const initials = displayName
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    if (file) {
      onProfileImageSelect(file);
    }

    // reset the input so selecting the same file twice still fires change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    onProfileImageRemove?.();
  };

  return (
    <section className={panelCardClass}>
      <div className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className={sectionHeadingClass}>Profile & identity</h3>
          <p className="mt-1 text-sm text-white/60">
            Update your display information, avatar preferences, and how you appear to collaborators.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-white sm:h-16 sm:w-16">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{initials || 'SN'}</span>
              )}
            </div>
            <div className="text-xs text-white/50">
              <p className="uppercase tracking-[0.28rem]">Member since</p>
              <p className="mt-1 font-plus-jakarta text-sm text-white/80">{createdAt}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleFileButtonClick}
              disabled={isUpdatingImage}
              className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatingImage ? 'Updating…' : 'Upload image'}
            </button>
            {onProfileImageRemove ? (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18rem] text-white/55">
            Display name
            <input
              type="text"
              name="username"
              value={profileForm.username}
              onChange={onChange}
              placeholder="e.g. Amjad Khan"
              className="rounded-2xl border border-white/10 bg-[#0B0B13] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#FF3B3B] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18rem] text-white/55">
            Primary email
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={onChange}
              placeholder="name@startupninja.ai"
              className="rounded-2xl border border-white/10 bg-[#0B0B13] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#FF3B3B] focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18rem] text-white/55">
          Timezone
          <select
            name="timezone"
            value={profileForm.timezone}
            onChange={onChange}
            className="rounded-2xl border border-white/10 bg-[#0B0B13] px-4 py-3 text-sm text-white focus:border-[#FF3B3B] focus:outline-none"
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="America/Chicago">Central Time (US & Canada)</option>
            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
            <option value="Europe/London">London (GMT+1)</option>
            <option value="Asia/Dubai">Dubai (GMT+4)</option>
            <option value="Asia/Karachi">Karachi (GMT+5)</option>
          </select>
        </label>

        <div className="flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            Your profile details are visible to team members you invite to Startup Ninja.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] px-6 py-2.5 text-xs font-semibold text-white shadow-[0_14px_32px_rgba(229,0,0,0.35)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProfileIdentityForm;
