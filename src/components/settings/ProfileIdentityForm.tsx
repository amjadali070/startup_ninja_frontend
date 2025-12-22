import { useRef, useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { FiEdit2 } from 'react-icons/fi';

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

  profileImageUrl,
  isUpdatingImage = false,
  onProfileImageSelect,
  onProfileImageRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    onSubmit(e);
    setIsEditing(false);
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-3 xs:mb-4">Profile & identity</h3>
        
        {/* Profile Picture and User Info */}
        <div className="flex items-start gap-3 xs:gap-4 mb-3 xs:mb-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-700">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-700/20 text-white text-sm xs:text-base sm:text-lg font-bold">
                  {initials || 'SN'}
                </div>
              )}
            </div>
          </div>
          
          {/* User Information */}
          <div className="flex-1">
            <h4 className="text-white text-base xs:text-lg font-bold font-plus-jakarta mb-1">{displayName}</h4>
            <div className="text-gray-400 text-xs xs:text-sm mb-1">Member Since</div>
            <div className="text-white text-sm xs:text-base">{createdAt}</div>
            
            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 mt-2 xs:mt-3">
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
                className="px-2 xs:px-3 py-1 xs:py-1.5 text-xs font-medium text-white border border-white/10 rounded-lg bg-transparent hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingImage ? 'Updating…' : 'Upload Image'}
              </button>
              {onProfileImageRemove && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-2 xs:px-3 py-1 xs:py-1.5 text-xs font-medium text-white border border-white/10 rounded-lg bg-transparent hover:bg-white/5 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-400 text-xs xs:text-sm">
          Update your details, photo, email, and/or preferences, and how you appear to collaborators.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSave}>
        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6">
          {/* Display Name Field */}
          <div>
            <label className="block text-white text-sm xs:text-base font-medium mb-2">Display Name</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={profileForm.username}
                onChange={onChange}
                placeholder="Enter display name"
                disabled={!isEditing}
                className={`w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 xs:py-3 pr-10 text-white placeholder:text-gray-400 focus:border-white/20 focus:outline-none text-sm xs:text-base ${
                  !isEditing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                title={isEditing ? "Cancel editing" : "Edit display name"}
              >
                <FiEdit2 className={`w-4 h-4 ${isEditing ? 'text-red-500' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Primary Email Field */}
          <div>
            <label className="block text-white text-sm xs:text-base font-medium mb-2">Primary Email</label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={onChange}
              placeholder="Enter email address"
              className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 xs:py-3 text-white placeholder:text-gray-400 focus:border-white/20 focus:outline-none text-sm xs:text-base cursor-not-allowed"
              disabled
            />
          </div>
        </div>
        
        {/* Visibility Information */}
        <p className="text-gray-400 text-xs xs:text-sm mb-4 xs:mb-5 sm:mb-6">
          Your profile details are visible to team members who are connected to on Startup Ninja.
        </p>
        
        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 xs:px-5 py-2.5 xs:py-3.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#FF1A1A] hover:to-[#A00000] text-white text-xs xs:text-sm font-bold rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
            >
              {isSaving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default ProfileIdentityForm;
