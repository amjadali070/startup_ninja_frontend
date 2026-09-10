import { FC, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import { userService } from "../../services/user";
import { useBusinessProfile } from "../../hooks/useBusinessProfile";

const INDUSTRIES = [
  "SaaS", "Agency", "Restaurant / Coffee", "Real Estate", "E-commerce",
  "Portfolio", "Personal Brand", "Consulting", "Construction", "Law",
  "Gym", "Beauty", "Automotive", "Hotel", "Startup", "Local Business", "Other",
];

const BRAND_TONES = [
  "Professional", "Friendly", "Bold", "Playful", "Luxury", "Minimal", "Technical",
];

type Step = 1 | 2 | 3;

interface FormState {
  businessName: string;
  industry: string;
  website: string;
  description: string;
  targetCustomer: string;
  products: string;
  brandTone: string;
  goals: string;
  socialAccounts: string;
}

const EMPTY_FORM: FormState = {
  businessName: "",
  industry: "",
  website: "",
  description: "",
  targetCustomer: "",
  products: "",
  brandTone: "",
  goals: "",
  socialAccounts: "",
};

const Onboarding: FC = () => {
  const navigate = useNavigate();
  const { refetchProfile } = useBusinessProfile();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const step1Valid = form.businessName.trim().length > 0 && form.industry.trim().length > 0;

  const goNext = () => {
    if (step === 1 && !step1Valid) {
      toast.error("Business name and industry are required.");
      return;
    }
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  };

  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const finish = async (skip: boolean) => {
    setSubmitting(true);
    try {
      const payload = skip
        ? { skippedOnboarding: true }
        : {
            businessName: form.businessName.trim(),
            industry: form.industry.trim(),
            website: form.website.trim(),
            description: form.description.trim(),
            targetCustomer: form.targetCustomer.trim(),
            products: form.products.trim(),
            brandTone: form.brandTone.trim(),
            goals: form.goals.trim(),
            socialAccounts: form.socialAccounts
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            completedOnboarding: true,
          };

      const res = await userService.updateBusinessProfile(payload);
      if (res.success) {
        await refetchProfile();
        toast.success(skip ? "Skipped — you can add this anytime in Settings." : "You're all set!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(res.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Onboarding save failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-10 rounded-full transition-colors ${
                  s <= step ? "bg-gradient-to-r from-[#DC2626] to-[#B91C1C]" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => finish(true)}
            disabled={submitting}
            className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#151515] p-6 sm:p-8">
          {step === 1 && (
            <>
              <h1 className="text-white text-xl sm:text-2xl font-bold font-plus-jakarta mb-1">
                Tell us about your business
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                This helps every Ninja tool — Chat, Website Builder, Social Pro, Image Gen — write with real context about your business instead of generic filler.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Business name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Rockets"
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    list="onboarding-industry-options"
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="e.g. Aerospace, SaaS, Restaurant"
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
                  />
                  <datalist id="onboarding-industry-options">
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Website (optional)</label>
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-white text-xl sm:text-2xl font-bold font-plus-jakarta mb-1">
                What do you offer, and to whom?
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                A short, honest description works better than a polished pitch — Ninja tools use this verbatim as context.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">What does your business do?</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. We build reusable rockets for small satellite launches"
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Who's your target customer?</label>
                  <input
                    type="text"
                    name="targetCustomer"
                    value={form.targetCustomer}
                    onChange={handleChange}
                    placeholder="e.g. Small satellite companies"
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Products / services</label>
                  <input
                    type="text"
                    name="products"
                    value={form.products}
                    onChange={handleChange}
                    placeholder="e.g. Launch services, satellite deployment"
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-white text-xl sm:text-2xl font-bold font-plus-jakarta mb-1">
                Brand & goals
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                Last step — this shapes the tone Ninja writes in.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Brand tone</label>
                  <div className="flex flex-wrap gap-2">
                    {BRAND_TONES.map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, brandTone: tone }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          form.brandTone === tone
                            ? "border-transparent bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white"
                            : "border-white/10 text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">What's your main goal right now?</label>
                  <input
                    type="text"
                    name="goals"
                    value={form.goals}
                    onChange={handleChange}
                    placeholder="e.g. Increase launch cadence and brand awareness"
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Social accounts (optional, comma-separated)</label>
                  <input
                    type="text"
                    name="socialAccounts"
                    value={form.socialAccounts}
                    onChange={handleChange}
                    placeholder="https://twitter.com/yourbrand, https://instagram.com/yourbrand"
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1 || submitting}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-0"
            >
              <FiArrowLeft className="h-4 w-4" /> Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#FF1A1A] hover:to-[#A00000] text-white text-sm font-bold rounded-lg transition-all shadow-lg"
              >
                Continue <FiArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => finish(false)}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#FF1A1A] hover:to-[#A00000] text-white text-sm font-bold rounded-lg transition-all shadow-lg disabled:opacity-60"
              >
                {submitting ? "Saving…" : (<>Finish <FiCheck className="h-4 w-4" /></>)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
