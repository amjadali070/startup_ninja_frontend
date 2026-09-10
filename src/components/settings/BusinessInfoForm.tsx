import { FC, useState, type ChangeEvent, type FormEvent } from "react";
import { FaEdit } from "react-icons/fa";
import type { BusinessProfile } from "../../services/user";

const INDUSTRIES = [
  "SaaS", "Agency", "Restaurant / Coffee", "Real Estate", "E-commerce",
  "Portfolio", "Personal Brand", "Consulting", "Construction", "Law",
  "Gym", "Beauty", "Automotive", "Hotel", "Startup", "Local Business", "Other",
];

export type BusinessInfoFormState = {
  businessName: string;
  industry: string;
  website: string;
  description: string;
  targetCustomer: string;
  products: string;
  brandTone: string;
  goals: string;
  socialAccounts: string; // comma-separated in the UI, split before saving
};

export const emptyBusinessInfoForm = (profile?: BusinessProfile | null): BusinessInfoFormState => ({
  businessName: profile?.businessName ?? "",
  industry: profile?.industry ?? "",
  website: profile?.website ?? "",
  description: profile?.description ?? "",
  targetCustomer: profile?.targetCustomer ?? "",
  products: profile?.products ?? "",
  brandTone: profile?.brandTone ?? "",
  goals: profile?.goals ?? "",
  socialAccounts: (profile?.socialAccounts ?? []).join(", "),
});

interface BusinessInfoFormProps {
  form: BusinessInfoFormState;
  isSaving: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const BusinessInfoForm: FC<BusinessInfoFormProps> = ({ form, isSaving, onChange, onSubmit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    onSubmit(e);
    setIsEditing(false);
  };

  const inputClass = (editing: boolean) =>
    `w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none ${
      !editing ? "cursor-not-allowed opacity-70" : ""
    }`;

  return (
    <section className="relative rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      <button
        type="button"
        onClick={() => setIsEditing(!isEditing)}
        className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors sm:right-6 sm:top-6"
        title={isEditing ? "Cancel editing" : "Edit business info"}
      >
        <FaEdit className={`h-5 w-5 ${isEditing ? "text-red-500" : ""}`} />
      </button>

      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-1">Business info</h3>
        <p className="text-gray-400 text-xs xs:text-sm">
          Used across Ninja Chat, Website Builder, Social Pro, and Image Gen so generated content reflects your real business.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 mb-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Business name</label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="e.g. Acme Rockets"
              className={inputClass(isEditing)}
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Industry</label>
            <input
              type="text"
              name="industry"
              list="business-industry-options"
              value={form.industry}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="e.g. Aerospace, SaaS, Restaurant"
              className={inputClass(isEditing)}
            />
            <datalist id="business-industry-options">
              {INDUSTRIES.map((i) => (
                <option key={i} value={i} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">Website</label>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="https://example.com"
            className={inputClass(isEditing)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">What does your business do?</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            disabled={!isEditing}
            rows={3}
            className={`${inputClass(isEditing)} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 mb-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Target customer</label>
            <input
              type="text"
              name="targetCustomer"
              value={form.targetCustomer}
              onChange={onChange}
              disabled={!isEditing}
              className={inputClass(isEditing)}
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Products / services</label>
            <input
              type="text"
              name="products"
              value={form.products}
              onChange={onChange}
              disabled={!isEditing}
              className={inputClass(isEditing)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 mb-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Brand tone</label>
            <input
              type="text"
              name="brandTone"
              value={form.brandTone}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="e.g. Bold and technical"
              className={inputClass(isEditing)}
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Current goal</label>
            <input
              type="text"
              name="goals"
              value={form.goals}
              onChange={onChange}
              disabled={!isEditing}
              className={inputClass(isEditing)}
            />
          </div>
        </div>

        <div className="mb-4 xs:mb-5 sm:mb-6">
          <label className="block text-white text-sm font-medium mb-2">Social accounts (comma-separated)</label>
          <input
            type="text"
            name="socialAccounts"
            value={form.socialAccounts}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="https://twitter.com/yourbrand, https://instagram.com/yourbrand"
            className={inputClass(isEditing)}
          />
        </div>

        {isEditing && (
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 xs:px-5 py-2.5 xs:py-3.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#FF1A1A] hover:to-[#A00000] text-white text-xs xs:text-sm font-bold rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
            >
              {isSaving ? "Saving…" : "Save business info"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default BusinessInfoForm;
