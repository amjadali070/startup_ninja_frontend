import { type FC, type ChangeEvent, type FormEvent } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export type LanguageRegionFormState = {
  language: string;
  timezone: string;
  dateFormat: string;
};

interface LanguageRegionFormProps {
  form: LanguageRegionFormState;
  isSaving: boolean;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const LanguageRegionForm: FC<LanguageRegionFormProps> = ({
  form,
  isSaving,
  onChange,
  onSubmit,
}) => {
  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-2">Language & Region</h3>
        <p className="text-gray-400 text-xs xs:text-sm">
          Set your language and regional preferences
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={onSubmit}>
        {/* Language Field */}
        <div className="mb-3 xs:mb-4">
          <label htmlFor="language" className="block text-white text-sm xs:text-base font-bold mb-2">
            Language
          </label>
          <div className="relative">
            <select
              id="language"
              name="language"
              value={form.language}
              onChange={onChange}
              className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 xs:py-3 pr-10 text-white focus:border-white/20 focus:outline-none cursor-pointer text-sm xs:text-base"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Arabic">Arabic</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <FiChevronDown className="h-3 w-3 xs:h-4 xs:w-4" />
            </div>
          </div>
        </div>

        {/* Timezone Field */}
        <div className="mb-3 xs:mb-4">
          <label htmlFor="timezone" className="block text-white text-sm xs:text-base font-bold mb-2">
            Timezone
          </label>
          <div className="relative">
            <select
              id="timezone"
              name="timezone"
              value={form.timezone}
              onChange={onChange}
              className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 xs:py-3 pr-10 text-white focus:border-white/20 focus:outline-none cursor-pointer text-sm xs:text-base"
            >
              <option value="PST (Pacific Standard Time)">PST (Pacific Standard Time)</option>
              <option value="EST (Eastern Standard Time)">EST (Eastern Standard Time)</option>
              <option value="CST (Central Standard Time)">CST (Central Standard Time)</option>
              <option value="MST (Mountain Standard Time)">MST (Mountain Standard Time)</option>
              <option value="GMT (Greenwich Mean Time)">GMT (Greenwich Mean Time)</option>
              <option value="CET (Central European Time)">CET (Central European Time)</option>
              <option value="JST (Japan Standard Time)">JST (Japan Standard Time)</option>
              <option value="AEST (Australian Eastern Standard Time)">AEST (Australian Eastern Standard Time)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <FiChevronDown className="h-3 w-3 xs:h-4 xs:w-4" />
            </div>
          </div>
        </div>

        {/* Date Format Field */}
        <div className="mb-4 xs:mb-6">
          <label htmlFor="dateFormat" className="block text-white text-sm xs:text-base font-bold mb-2">
            Date Format
          </label>
          <div className="relative">
            <select
              id="dateFormat"
              name="dateFormat"
              value={form.dateFormat}
              onChange={onChange}
              className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 xs:py-3 pr-10 text-white focus:border-white/20 focus:outline-none cursor-pointer text-sm xs:text-base"
            >
              <option value="MM/DD/YY">MM/DD/YY</option>
              <option value="DD/MM/YY">DD/MM/YY</option>
              <option value="YY/MM/DD">YY/MM/DD</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY/MM/DD">YYYY/MM/DD</option>
              <option value="MMM DD, YYYY">MMM DD, YYYY</option>
              <option value="DD MMM YYYY">DD MMM YYYY</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <FiChevronDown className="h-3 w-3 xs:h-4 xs:w-4" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2 xs:gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 xs:px-5 py-2.5 xs:py-3.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#FF1A1A] hover:to-[#A00000] text-white text-xs xs:text-sm font-bold rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default LanguageRegionForm;
