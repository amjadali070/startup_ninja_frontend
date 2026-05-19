import { type FC, type ChangeEvent, type FormEvent } from "react";
import { FiChevronDown } from "react-icons/fi";
import { TIMEZONE_GROUPS } from "../../constants/timezones";

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
      <div className="mb-2 xs:mb-1 sm:mb-1">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-1">
          Timezone
        </h3>
        <p className="text-gray-400 text-xs xs:text-sm">
          Used to schedule your social media posts at the correct local time.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={onSubmit} className="mt-4">
        {/* Timezone Field */}
        <div className="mb-3 xs:mb-4">
          <div className="relative">
            <select
              id="timezone"
              name="timezone"
              value={form.timezone}
              onChange={onChange}
              className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 xs:py-3 pr-10 text-white focus:border-white/20 focus:outline-none cursor-pointer text-sm xs:text-base"
            >
              <option value="" disabled>
                — Select your timezone —
              </option>
              {TIMEZONE_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label} ({tz.offset})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <FiChevronDown className="h-3 w-3 xs:h-4 xs:w-4" />
            </div>
          </div>

          {/* Show current selection as IANA id for transparency */}
          {form.timezone && (
            <p className="mt-1.5 text-xs text-gray-500">
              IANA ID:{" "}
              <span className="font-mono text-gray-400">{form.timezone}</span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-2 xs:gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 xs:px-5 py-2.5 xs:py-3.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#FF1A1A] hover:to-[#A00000] text-white text-xs xs:text-sm font-bold rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default LanguageRegionForm;
