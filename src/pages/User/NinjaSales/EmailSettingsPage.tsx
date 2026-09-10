import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { FiMail, FiLock, FiCheckCircle, FiXCircle, FiTrash2, FiLoader, FiSend, FiShield, FiEyeOff, FiClock } from "react-icons/fi";
import { ninjaSalesService, EmailSettings } from "../../../services/ninjaSales";

const DEFAULT_FORM = {
  smtpHost: "",
  smtpPort: "587",
  smtpSecure: false,
  smtpUser: "",
  smtpPassword: "",
  fromEmail: "",
  fromName: "",
  replyToEmail: "",
};

const EmailSettingsPage: FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  /** Same rule the backend enforces: only the account owner or a manager can view/manage this. */
  const canManage = Boolean(user && (!user.addedBy || user.teamRole === "Manager"));

  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  const load = async () => {
    setLoading(true);
    const res = await ninjaSalesService.getEmailSettings();
    if (res.success) {
      setForbidden(false);
      if (res.data) {
        setSettings(res.data);
        setForm({
          smtpHost: res.data.smtpHost,
          smtpPort: String(res.data.smtpPort),
          smtpSecure: res.data.smtpSecure,
          smtpUser: res.data.smtpUser,
          smtpPassword: "",
          fromEmail: res.data.fromEmail,
          fromName: res.data.fromName || "",
          replyToEmail: res.data.replyToEmail || "",
        });
      } else {
        setSettings(null);
      }
    } else if (res.message?.toLowerCase().includes("owner or a manager")) {
      setForbidden(true);
    }
    setLoading(false);
  };

  useEffect(() => { if (canManage) load(); else setLoading(false); }, [canManage]);

  const handleChange = (field: keyof typeof DEFAULT_FORM, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error("Sales logout failed:", err); } finally { navigate("/login", { replace: true }); }
  };

  const handleSave = async () => {
    if (!form.smtpHost || !form.smtpPort || !form.smtpUser || !form.fromEmail) {
      toast.error("Host, port, username and from-email are required");
      return;
    }
    if (!settings && !form.smtpPassword) {
      toast.error("Password is required the first time you connect your SMTP account");
      return;
    }
    setSaving(true);
    const res = await ninjaSalesService.saveEmailSettings({
      smtpHost: form.smtpHost,
      smtpPort: parseInt(form.smtpPort, 10) || 587,
      smtpSecure: form.smtpSecure,
      smtpUser: form.smtpUser,
      smtpPassword: form.smtpPassword || undefined,
      fromEmail: form.fromEmail,
      fromName: form.fromName || undefined,
      replyToEmail: form.replyToEmail || undefined,
    });
    setSaving(false);
    if (res.success) {
      toast.success(res.message || "Email settings saved");
      setSettings(res.data);
      setForm((prev) => ({ ...prev, smtpPassword: "" }));
    } else {
      toast.error(res.message || "Failed to save email settings");
    }
  };

  const handleTest = async () => {
    setTesting(true);
    const res = await ninjaSalesService.testEmailSettings();
    setTesting(false);
    if (res.success) {
      toast.success(res.message || "Test email sent");
      setSettings(res.data);
    } else {
      toast.error(res.message || "Test email failed");
      await load();
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    const res = await ninjaSalesService.deleteEmailSettings();
    setRemoving(false);
    if (res.success) {
      toast.success("Email settings removed");
      setSettings(null);
      setForm(DEFAULT_FORM);
    } else {
      toast.error(res.message || "Failed to remove email settings");
    }
  };

  const verifiedAtDate = settings?.verifiedAt ? new Date(settings.verifiedAt) : null;
  const verifiedAtLabel =
    verifiedAtDate && !Number.isNaN(verifiedAtDate.getTime())
      ? verifiedAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : null;

  return (
    <DashboardLayout activePath="/ai-tools/sales/email-settings" title="Email Sending - Ninja Sales" onLogout={handleLogout} onSettings={() => navigate("/settings")}>
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        <div className="p-4 lg:p-8 space-y-8 max-w-auto mx-auto text-white pb-20">

          <NinjaSalesHeader
            title="Email Sending"
            subtitle="Connect your own SMTP account so proposals and invoices are emailed to your clients from your own address — never from Startup Ninja's."
          />

          {!canManage ? (
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-16 text-center space-y-3">
              <FiShield className="w-8 h-8 text-white/15 mx-auto" />
              <p className="text-sm font-bold text-white/40">Restricted to the account owner and managers</p>
              <p className="text-xs text-white/20 max-w-sm mx-auto">Email sending credentials are confidential account configuration. Ask your account owner or a manager to set this up.</p>
            </div>
          ) : loading ? (
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-16 text-center text-white/40">
              <FiLoader className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : forbidden ? (
            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-16 text-center space-y-3">
              <FiShield className="w-8 h-8 text-white/15 mx-auto" />
              <p className="text-sm font-bold text-white/40">You don't have permission to view this</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left: SMTP Configuration form */}
              <div className="xl:col-span-8">
                <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.15em] flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-red-500" /> SMTP Configuration
                    </h2>
                    {settings && (
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${settings.verified ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"}`}>
                        {settings.verified ? <FiCheckCircle className="w-3 h-3" /> : <FiXCircle className="w-3 h-3" />}
                        {settings.verified ? "Verified" : "Not Verified"}
                      </span>
                    )}
                  </div>

                  {settings?.lastTestError && (
                    <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
                      Last test failed: {settings.lastTestError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">SMTP Host</label>
                      <input autoComplete="off" value={form.smtpHost} onChange={(e) => handleChange("smtpHost", e.target.value)} placeholder="smtp.yourdomain.com" className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Port</label>
                      <input autoComplete="off" value={form.smtpPort} onChange={(e) => handleChange("smtpPort", e.target.value)} placeholder="587" className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">SMTP Username</label>
                      <input autoComplete="off" value={form.smtpUser} onChange={(e) => handleChange("smtpUser", e.target.value)} placeholder="you@yourdomain.com" className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        SMTP Password {settings && <span className="text-white/25 normal-case font-medium">(leave blank to keep current)</span>}
                      </label>
                      <input type="password" autoComplete="new-password" value={form.smtpPassword} onChange={(e) => handleChange("smtpPassword", e.target.value)} placeholder={settings ? "••••••••" : "Required"} className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">From Email</label>
                      <input autoComplete="off" type="email" value={form.fromEmail} onChange={(e) => handleChange("fromEmail", e.target.value)} placeholder="hello@yourdomain.com" className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">From Name</label>
                      <input autoComplete="off" value={form.fromName} onChange={(e) => handleChange("fromName", e.target.value)} placeholder="Your Company" className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Reply-To (Optional)</label>
                      <input autoComplete="off" type="email" value={form.replyToEmail} onChange={(e) => handleChange("replyToEmail", e.target.value)} placeholder="support@yourdomain.com" className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-sm font-black text-white outline-none focus:border-red-500/30 placeholder:text-white/20 placeholder:font-medium" />
                    </div>
                    <label className="flex items-center gap-2.5 cursor-pointer self-end pb-3">
                      <input type="checkbox" checked={form.smtpSecure} onChange={(e) => handleChange("smtpSecure", e.target.checked)} className="w-4 h-4 accent-red-600" />
                      <span className="text-xs text-white/60">Use SSL (port 465)</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-2 flex-wrap border-t border-white/5 mt-2">
                    <button onClick={handleSave} disabled={saving} className="h-12 px-6 bg-red-600 hover:bg-red-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-red-600/20 transition-all disabled:opacity-40 flex items-center gap-2.5 mt-4">
                      {saving && <FiLoader className="w-4 h-4 animate-spin" />}
                      {saving ? "Saving..." : "Save"}
                    </button>
                    {settings && (
                      <>
                        <button onClick={handleTest} disabled={testing} className="h-12 px-6 bg-white/5 border border-white/[0.06] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/70 hover:bg-white/10 transition-all disabled:opacity-40 flex items-center gap-2.5 mt-4">
                          {testing ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSend className="w-4 h-4" />}
                          {testing ? "Sending..." : "Send Test Email"}
                        </button>
                        <button onClick={handleRemove} disabled={removing} className="h-12 px-5 bg-white/5 border border-white/[0.06] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-red-400 hover:border-red-500/30 transition-all disabled:opacity-40 flex items-center gap-2.5 mt-4">
                          <FiTrash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Security & status aside */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
                      <FiLock className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">Security &amp; Access</h2>
                      <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-400">
                        <FiEyeOff className="w-2.5 h-2.5" /> Confidential
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Your SMTP password is encrypted at rest and is never shown again after saving — not to you, not to your team, not in any API response.
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Only the account owner and managers can view or change this page. Other team members can still send documents using it, but can't see or edit the credentials.
                  </p>
                </div>

                {settings && (
                  <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                      <FiClock className="w-3.5 h-3.5" /> Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">Verification</span>
                        <span className={`text-xs font-bold ${settings.verified ? "text-emerald-400" : "text-orange-400"}`}>{settings.verified ? "Verified" : "Not Verified"}</span>
                      </div>
                      {verifiedAtLabel && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/40">Last Verified</span>
                          <span className="text-xs font-bold text-white/60">{verifiedAtLabel}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">Sending From</span>
                        <span className="text-xs font-bold text-white/60 truncate max-w-[160px]">{settings.fromEmail}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default EmailSettingsPage;
