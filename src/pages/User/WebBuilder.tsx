import { useEffect, useState, type FC } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import CreateWebsiteWizard from "../../components/web-builder/CreateWebsiteWizard";
import DomainSettingsModal from "../../components/web-builder/DomainSettingsModal";
import VerifyDomainModal from "../../components/web-builder/VerifyDomainModal";
import PagesManagerModal from "../../components/web-builder/PagesManagerModal";
import {
  FiCheckCircle,
  FiEdit2,
  FiEye,
  FiGlobe,
  FiMinusCircle,
  FiSmartphone,
  FiSettings,
  FiSearch,
  FiMoreVertical,
  FiTrash2,
  FiFile,
  FiShare2,
} from "react-icons/fi";
import PublishWebsiteModal from "../../components/web-builder/PublishWebsiteModal";
import AlertModal from "../../components/AlertModal";
import { PREVIEW_DEVICE_SIZES } from "../../components/web-builder/config/previewDevices";
import SEOSettingsModal from "../../components/web-builder/SEOSettingsModal";
import SocialLinksModal from "../../components/web-builder/SocialLinksModal";
import { CiDesktop } from "react-icons/ci";
import { SlScreenTablet } from "react-icons/sl";
import { BiPlus } from "react-icons/bi";
import WebBuilderService from "../../services/web-builder/WebBuilderService";
import moment from "moment-timezone";
import grapesjs from "grapesjs";
import LoadingSpinner from "../../components/LoadingSpinner";

// Environment variables
const WEB_BUILDER_SERVICE_URL = import.meta.env.VITE_WEB_BUILDER_SERVICE_URL;

const WebBuilder: FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedDomainWebsite, setSelectedDomainWebsite] = useState<
    any | null
  >(null);
  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);
  const [selectedSEOWebsite, setSelectedSEOWebsite] = useState<any | null>(
    null
  );
  const [isSocialLinksModalOpen, setIsSocialLinksModalOpen] = useState(false);
  const [selectedSocialLinksWebsite, setSelectedSocialLinksWebsite] = useState<any | null>(
    null
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [websiteToDelete, setWebsiteToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [websiteToPublish, setWebsiteToPublish] = useState<any | null>(null);
  const [isPublishingWebsite, setIsPublishingWebsite] = useState(false);
  const [isPagesModalOpen, setIsPagesModalOpen] = useState(false);
  const [selectedPagesWebsite, setSelectedPagesWebsite] = useState<any | null>(
    null
  );
  // const [previewMap, setPreviewMap] = useState<{ [id: string]: string }>({});
  const [previewWebsite, setPreviewWebsite] = useState<any | null>(null);
  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    // AuthProvider hydrates `user` from storage asynchronously, one tick
    // after this effect can first fire — waiting on user?.id in the deps
    // (rather than an empty array) makes this re-run once it's actually
    // populated, instead of silently no-op'ing and showing a false "No
    // Websites Yet" on a direct/hard navigation to this page.
    if (!user?.id) return;

    fetchWebsites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // useEffect(() => {
  //   const buildPreviews = async () => {
  //     const previews: { [id: string]: string } = {};

  //     for (const site of websites) {
  //       if (site.websiteData && Object.keys(site.websiteData).length > 0) {
  //         previews[site._id] = await generateHTML(site.websiteData);
  //       }
  //     }

  //     setPreviewMap(previews);
  //   };

  //   if (websites.length > 0) buildPreviews();
  // }, [websites]);

  const fetchWebsites = async () => {
    setLoading(true);
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const response = await WebBuilderService.getUserWebsites(user.id);
    if (response.success && response.data) {
      const freshWebsites = response.data;
      setWebsites(freshWebsites);

      // Real bug found and fixed: selectedDomainWebsite is a separate piece
      // of state, captured once when the domain modal opens — calling
      // fetchWebsites() (onUpdate()) refreshes the card list behind it, but
      // never touched this reference, so VerifyDomainModal kept rendering
      // its "pending, here's your DNS records" view forever, even right
      // after a real, successful verification (confirmed live: the success
      // toast fired correctly, but the modal itself never advanced past the
      // pending panel). Only matters for the domain modals specifically —
      // they're the only ones where the user stays in the modal watching an
      // async status change; SEO/Social Links/Delete all close immediately
      // after their action, so this staleness was never visible there.
      setSelectedDomainWebsite((prev: any) =>
        prev ? freshWebsites.find((w: any) => w._id === prev._id) || prev : prev
      );
    } else {
      console.error(response.message);
      toast.error(response.message || "Failed to load your websites. Please try again.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Social Media Studio logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const truncateText = (text: string, limit = 50) =>
    text
      ? text.length > limit
        ? text.slice(0, limit) + "..."
        : text
      : "No description";

  const handleEditWebsite = async (siteId: string) => {
    const loadingToast = toast.loading("Checking session limits...");
    try {
      const response = await authService.checkUsageLimit(
        "web_builder_sessions",
        true
      );
      toast.dismiss(loadingToast);

      if (response.allowed) {
        window.open(`/ai-tools/web-builder/new-website?id=${siteId}`, "_blank");
      } else {
        toast.error(
          response.message ||
            "You have reached your limit for Web Builder sessions. Please upgrade your plan."
        );
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to check limits. Please try again.");
    }
  };

  const PreviewModal = () => {
    const [animateIn, setAnimateIn] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setAnimateIn(true), 20);
      return () => clearTimeout(timer);
    }, []);

    if (!previewWebsite) return null;

    const current = PREVIEW_DEVICE_SIZES[previewDevice];

    const handleClose = () => {
      setClosing(true);
      setAnimateIn(false);

      setTimeout(() => {
        setPreviewWebsite(null);
        setClosing(false);
      }, 350);
    };

    return (
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex flex-col transition-opacity duration-300 ${
          animateIn && !closing ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Bar */}
        <div
          className={`flex justify-between items-center px-6 py-4 bg-[#1f1f1f] border-b border-[#333] transform transition-all duration-300 
          ${
            animateIn && !closing
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="text-white font-semibold text-lg">
            {previewWebsite.title}
          </div>

          <div className="flex items-center gap-2">
            {["desktop", "tablet", "mobile"].map((device) => (
              <button
                key={device}
                onClick={() => setPreviewDevice(device as any)}
                className={`device-btn px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 
                  ${
                    previewDevice === device
                      ? "bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white"
                      : "bg-[#2c2c2c] text-gray-300 hover:bg-[#3a3a3a]"
                  }`}
              >
                {device === "desktop" && <CiDesktop className="w-4 h-4" />}
                {device === "tablet" && <SlScreenTablet className="w-4 h-4" />}
                {device === "mobile" && <FiSmartphone className="w-4 h-4" />}
                {device.charAt(0).toUpperCase() + device.slice(1)}
              </button>
            ))}
            <button
              onClick={handleClose}
              className="ml-3 text-gray-400 hover:text-white transition-all text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto flex justify-center items-start bg-[#181818] p-5">
          <div
            className={`bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform 
              ${
                animateIn && !closing
                  ? "scale-100 opacity-100"
                  : "scale-90 opacity-0"
              }`}
            style={{
              width: current.width,
              maxWidth: current.maxWidth,
              height: "calc(100vh - 100px)",
            }}
          >
            <iframe
              srcDoc={previewWebsite.html}
              title="Website Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleOpenDomainSettings = (site: any) => {
    setSelectedDomainWebsite(site);
    // If domain already connected, open verify modal, otherwise open connect modal
    if (site.customDomain) {
      setIsVerifyModalOpen(true);
    } else {
      setIsDomainModalOpen(true);
    }
  };

  const handleDomainConnected = () => {
    setIsDomainModalOpen(false);
    setIsVerifyModalOpen(true);
  };

  const handleOpenSEOSettings = (site: any) => {
    setSelectedSEOWebsite(site);
    setIsSEOModalOpen(true);
  };

  const handleOpenSocialLinks = (site: any) => {
    setSelectedSocialLinksWebsite(site);
    setIsSocialLinksModalOpen(true);
  };

  const handleDeleteWebsite = (site: any) => {
    setWebsiteToDelete(site);
  };

  const handleConfirmDeleteWebsite = async () => {
    if (!websiteToDelete || !user?.id) return;
    setIsDeleting(true);
    try {
      const response = await WebBuilderService.deleteWebsite(
        user.id,
        websiteToDelete._id
      );
      if (response.success) {
        toast.success("Website deleted");
        setWebsiteToDelete(null);
        fetchWebsites();
      } else {
        toast.error(response.message || "Failed to delete website");
      }
    } catch (err) {
      toast.error("Failed to delete website");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenPagesManager = (site: any) => {
    setSelectedPagesWebsite(site);
    setIsPagesModalOpen(true);
  };

  const handleOpenPublishModal = (site: any) => {
    setWebsiteToPublish(site);
  };

  const handleConfirmPublishWebsite = async () => {
    if (!websiteToPublish || !user?.id) return;
    setIsPublishingWebsite(true);
    try {
      const websiteHtml = await generateHTML(websiteToPublish.websiteData);
      const response = await WebBuilderService.publishWebsite(
        user.id,
        websiteToPublish._id,
        websiteHtml
      );
      if (response.success) {
        toast.success("Website published successfully!");
        setWebsiteToPublish(null);
        fetchWebsites();
      } else {
        toast.error(response.message || "Failed to publish website");
      }
    } catch (err) {
      toast.error("Failed to publish website");
    } finally {
      setIsPublishingWebsite(false);
    }
  };

  const handlePreviewStaging = async (site: any) => {
    if (!site.websiteData || Object.keys(site.websiteData).length === 0) return;

    const websiteHtml = await generateHTML(site.websiteData);
    setPreviewWebsite({
      html: websiteHtml,
      title: site.websiteTitle || site.title,
    });
    setPreviewDevice("desktop");
  };

  const generateHTML = async (projectData: any) => {
    const editor = grapesjs.init({
      container: document.createElement("div"),
      storageManager: false,
    });

    await editor.loadProjectData(projectData);
    const html = editor.getHtml();
    const rawCss = editor.getCss() || "";
    const css = rawCss.replace(
      /@media\s*\(\s*max-width\s*:\s*1800px\s*\)/gi,
      "@media screen"
    );
    editor.destroy();

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${css}</style>
      </head>
      <body style="margin:0;">${html}</body>
    </html>
  `;
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/web-builder"
      title="Ninja Website Builder"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Hero Section */}
          <div className="mb-6">
            <section className="relative w-full overflow-hidden rounded-[16px] border border-black bg-[url('/images/welcome-bg.png')] bg-cover bg-center bg-no-repeat border-[#ff3b3b47]">
              <div className="absolute inset-0 bg-[#f5212e0d]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
                <div className="flex-1 min-w-0">
                  <h2 className="font-plus-jakarta w-full text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-[32px] md:text-[26px] md:leading-[36px]">
                    Start Building Your Website
                  </h2>
                  <p className="font-plus-jakarta mt-1 text-xs leading-5 text-gray-300 sm:mt-2 sm:text-sm sm:leading-6 md:text-[16px] md:leading-[24px]">
                    Choose a template or start from scratch, our AI builds your
                    website in minutes.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="font-plus-jakarta inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:shadow-lg sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    <BiPlus className="h-4 w-4" />
                    <span>Start New Website</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Websites Section */}
          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
              Your Recent Websites
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Manage and track all your created websites
            </p>

            {loading ? (
              <div className="flex items-center justify-center min-h-[400px] w-full">
                <LoadingSpinner size="medium" variant="dark" />
              </div>
            ) : websites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-6 rounded-2xl shadow-lg max-w-md">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    No Websites Yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    You haven't created any website projects yet. Get started
                    now and build something amazing!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {websites.map((site) => {
                  const isPublished = !!site.publishedLink;
                  // Guard against missing/malformed createdAt — without this,
                  // moment renders the literal text "Invalid date" for a bad
                  // value, and silently mislabels a genuinely missing value
                  // as "a few seconds ago" (moment defaults an undefined
                  // input to "now").
                  const createdMoment = site.createdAt
                    ? moment.tz(site.createdAt, "Asia/Karachi")
                    : null;
                  const createdTime =
                    createdMoment && createdMoment.isValid()
                      ? createdMoment.fromNow()
                      : "—";
                  const hasWebsiteData =
                    site.websiteData &&
                    Object.keys(site.websiteData).length > 0;

                  return (
                    <div
                      key={site._id}
                      className="group relative bg-[#121212] border border-[#2c2c2c] rounded-xl overflow-hidden transition-all duration-300"
                    >
                      {/* Hover Overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                        style={{
                          background:
                            "linear-gradient(131deg, #81000057, rgb(0 0 0 / 30%)), linear-gradient(167.91deg, rgba(129, 0, 0, 0.5) 27.29%, rgba(58, 0, 0, 0.5) 45.33%, rgba(29, 0, 0, 0.25) 87.42%, rgb(220 65 220 / 50%) 123.5%)",
                        }}
                      />

                      <div className="relative z-10">
                        {!hasWebsiteData || !site.websitePreview ? (
                          <img
                            src="/images/no-preview.png"
                            alt={site.title}
                            className="preview-website-img"
                          />
                        ) : (
                          <img
                            src={
                              site.websitePreview.startsWith("http")
                                ? site.websitePreview
                                : `${
                                    WEB_BUILDER_SERVICE_URL ||
                                    "http://localhost:3004"
                                  }${site.websitePreview}`
                            }
                            alt={site.title}
                            className="preview-website-img"
                          />
                        )}

                        {/* Info */}
                        <div className="p-4">
                          <h4 className="text-white font-semibold text-base flex items-center gap-2">
                            {site.websiteTitle ||
                              site.title ||
                              "Untitled Website"}
                          </h4>
                          <p className="text-gray-400 text-sm mb-2">
                            {truncateText(site.websiteDescription)}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                            {isPublished ? (
                              <button
                                type="button"
                                title="View Published Website"
                                onClick={() =>
                                  window.open(
                                    site.publishedLink.startsWith("http")
                                      ? site.publishedLink
                                      : `${WEB_BUILDER_SERVICE_URL}${site.publishedLink}`,
                                    "_blank"
                                  )
                                }
                                className="flex items-center gap-1 font-medium text-green-500 hover:text-green-400 hover:underline"
                              >
                                <FiCheckCircle className="w-4 h-4" />
                                Published
                              </button>
                            ) : (
                              <span className="flex items-center gap-1 font-medium text-red-500">
                                <FiMinusCircle className="w-4 h-4" />
                                Draft
                              </span>
                            )}
                            <span>{createdTime}</span>
                          </div>

                          {/* Domain/SSL status — feedback.md asks to "show domain
                              connection, SSL and publishing status clearly"; this
                              used to be invisible unless you opened the overflow
                              menu. Clicking it jumps straight to the same modal
                              the overflow menu's "Domain Settings" opens. */}
                          {site.customDomain && (
                            <button
                              type="button"
                              onClick={() => handleOpenDomainSettings(site)}
                              title={
                                site.customDomainStatus === "verified"
                                  ? "Domain verified — an HTTPS certificate is being provisioned automatically"
                                  : "Domain connected — DNS verification pending"
                              }
                              className={`w-full flex items-center gap-1.5 text-[11px] mb-3 px-2 py-1.5 rounded-md border ${
                                site.customDomainStatus === "verified"
                                  ? "text-green-500 border-green-900/40 bg-green-500/5 hover:bg-green-500/10"
                                  : "text-yellow-500 border-yellow-900/40 bg-yellow-500/5 hover:bg-yellow-500/10"
                              }`}
                            >
                              <FiGlobe className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate flex-1 text-left">{site.customDomain}</span>
                              <span className="flex-shrink-0 font-medium">
                                {site.customDomainStatus === "verified" ? "Domain Verified" : "Pending DNS"}
                              </span>
                            </button>
                          )}

                          {/* Action Buttons — feedback.md asks for "Edit, Preview
                              and Publish only" on this list; Domain/SEO/Delete
                              are real but secondary, so they live in the
                              overflow menu instead of cluttering the primary row. */}
                          <div className="flex flex-col gap-2">
                            {/* Primary Action */}
                            <button
                              title="Edit Website"
                              onClick={() => handleEditWebsite(site._id)}
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:shadow-lg text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-all active:scale-95"
                            >
                              <FiEdit2 className="w-4 h-4" />
                              Edit Website
                            </button>

                            <div className="flex items-center gap-2">
                              {/* Staging Preview */}
                              <button
                                title={
                                  !hasWebsiteData
                                    ? "No Staging Preview Available"
                                    : "Preview Staging Website"
                                }
                                disabled={!hasWebsiteData}
                                onClick={() => handlePreviewStaging(site)}
                                className={`flex-1 p-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 border text-xs font-medium ${
                                  hasWebsiteData
                                    ? "bg-[#252525] text-gray-300 hover:text-white hover:bg-[#333] border-[#333]"
                                    : "bg-[#1a1a1a] text-gray-600 cursor-not-allowed opacity-60 border-transparent"
                                }`}
                              >
                                <FiEye className="w-4 h-4" /> Preview
                              </button>

                              {/* Real one-click publish — reuses the same headless-GrapesJS
                                  generateHTML() helper Preview Staging already relies on to turn
                                  the stored websiteData into final HTML, so this doesn't need the
                                  full editor open at all. Status pill above (when published)
                                  doubles as "view live". */}
                              <button
                                title={
                                  !hasWebsiteData
                                    ? "Nothing to publish yet — edit the website first"
                                    : isPublished
                                    ? "Republish latest changes"
                                    : "Publish Website"
                                }
                                disabled={!hasWebsiteData}
                                onClick={() => handleOpenPublishModal(site)}
                                className={`flex-1 p-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 border text-xs font-medium ${
                                  hasWebsiteData
                                    ? "bg-[#252525] text-gray-300 hover:text-white hover:bg-[#333] border-[#333]"
                                    : "bg-[#1a1a1a] text-gray-600 cursor-not-allowed opacity-60 border-transparent"
                                }`}
                              >
                                <FiGlobe className="w-4 h-4" /> Publish
                              </button>

                              {/* Overflow: Domain / SEO / Delete */}
                              <div className="relative">
                                <button
                                  title="More options"
                                  onClick={() =>
                                    setOpenMenuId(openMenuId === site._id ? null : site._id)
                                  }
                                  className="p-2.5 rounded-lg transition-all flex items-center justify-center bg-[#252525] text-gray-300 hover:text-white hover:bg-[#333] border border-[#333]"
                                >
                                  <FiMoreVertical className="w-4 h-4" />
                                </button>
                                {openMenuId === site._id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenMenuId(null)}
                                    />
                                    <div className="absolute right-0 bottom-full mb-2 z-20 w-44 rounded-lg bg-[#1a1a1a] border border-[#333] shadow-xl py-1">
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          handleOpenDomainSettings(site);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white"
                                      >
                                        <FiSettings className="w-3.5 h-3.5" /> Domain Settings
                                      </button>
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          handleOpenSEOSettings(site);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white"
                                      >
                                        <FiSearch className="w-3.5 h-3.5" /> SEO Settings
                                      </button>
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          handleOpenSocialLinks(site);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white"
                                      >
                                        <FiShare2 className="w-3.5 h-3.5" /> Social Links
                                      </button>
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          handleOpenPagesManager(site);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white"
                                      >
                                        <FiFile className="w-3.5 h-3.5" /> Manage Pages
                                      </button>
                                      <div className="my-1 border-t border-[#333]" />
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          handleDeleteWebsite(site);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                      >
                                        <FiTrash2 className="w-3.5 h-3.5" /> Delete Website
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <CreateWebsiteWizard
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreated={fetchWebsites}
          />
          <DomainSettingsModal
            isOpen={isDomainModalOpen}
            onClose={() => setIsDomainModalOpen(false)}
            website={selectedDomainWebsite}
            onUpdate={fetchWebsites}
            onConnectedSuccess={handleDomainConnected}
          />
          <VerifyDomainModal
            isOpen={isVerifyModalOpen}
            onClose={() => setIsVerifyModalOpen(false)}
            website={selectedDomainWebsite}
            onUpdate={fetchWebsites}
          />

          <SEOSettingsModal
            isOpen={isSEOModalOpen}
            onClose={() => setIsSEOModalOpen(false)}
            website={selectedSEOWebsite}
            onUpdate={fetchWebsites}
          />

          <SocialLinksModal
            isOpen={isSocialLinksModalOpen}
            onClose={() => setIsSocialLinksModalOpen(false)}
            website={selectedSocialLinksWebsite}
            onUpdate={fetchWebsites}
          />

          <AlertModal
            isOpen={!!websiteToDelete}
            type="danger"
            action="delete"
            title="Delete Website"
            message={
              <p className="text-white/80 text-sm leading-relaxed">
                Are you sure you want to delete{" "}
                <b>
                  {websiteToDelete?.websiteTitle ||
                    websiteToDelete?.title ||
                    "this website"}
                </b>
                ? This permanently removes the website, its published pages,
                and any uploaded documents. This action cannot be undone.
              </p>
            }
            confirmText="Delete Website"
            cancelText="Cancel"
            onClose={() => {
              if (!isDeleting) setWebsiteToDelete(null);
            }}
            onConfirm={handleConfirmDeleteWebsite}
            isLoading={isDeleting}
            loadingText="Deleting..."
          />

          <PublishWebsiteModal
            isOpen={!!websiteToPublish}
            websiteTitle={websiteToPublish?.websiteTitle || websiteToPublish?.title || "this website"}
            isRepublish={!!websiteToPublish?.publishedLink}
            onClose={() => {
              if (!isPublishingWebsite) setWebsiteToPublish(null);
            }}
            onConfirm={handleConfirmPublishWebsite}
            isPublishing={isPublishingWebsite}
          />

          <PagesManagerModal
            isOpen={isPagesModalOpen}
            onClose={() => setIsPagesModalOpen(false)}
            website={selectedPagesWebsite}
          />
        </div>
      </main>
      {previewWebsite && <PreviewModal />}
    </DashboardLayout>
  );
};
export default WebBuilder;
