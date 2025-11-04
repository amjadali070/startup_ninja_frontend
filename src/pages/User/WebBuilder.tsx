import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import CreateWebsiteModal from "../../components/web-builder/CreateWebsiteModal";
import {
  FiCheckCircle,
  FiEdit2,
  FiEye,
  FiGlobe,
  FiMinusCircle,
  FiSmartphone,
} from "react-icons/fi";
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

    fetchWebsites();
  }, []);

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
      setWebsites(response.data);
    } else {
      console.error(response.message);
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

  const PreviewModal = () => {
    const [animateIn, setAnimateIn] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setAnimateIn(true), 20);
      return () => clearTimeout(timer);
    }, []);

    if (!previewWebsite) return null;

    const deviceSizes: any = {
      desktop: { width: "100%", maxWidth: "1200px" },
      tablet: { width: "768px", maxWidth: "992px" },
      mobile: { width: "420px", maxWidth: "600px" },
    };

    const current = deviceSizes[previewDevice];

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
    const css = editor.getCss();
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
                  const createdTime = moment
                    .tz(site.createdAt, "Asia/Karachi")
                    .fromNow();
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
                        {!hasWebsiteData ? (
                          <img
                            src="/images/no-preview.png"
                            alt={site.title}
                            className="preview-website-img"
                          />
                        ) : (
                          <img
                            src={"http://localhost:3004" + site.websitePreview}
                            alt={site.title}
                            className="preview-website-img"
                          />
                          // <div className="relative w-full h-[190px] overflow-hidden rounded-lg border-none">
                          //   <div className="iframe-scale-wrapper"
                          //     style={{ transformOrigin: 'top left', pointerEvents: 'none', width: '100%',height: '100%'}}>
                          //     <iframe srcDoc={previewMap[site._id] || ""} title={site.title} className="w-[1200px] h-[900px] border-none rounded-lg"
                          //       style={{ transformOrigin: 'top left',transform: 'scale(var(--iframe-scale))', pointerEvents: 'none', }} />
                          //   </div>
                          // </div>
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
                            <span
                              className={`flex items-center gap-1 font-medium ${
                                site.status === 1
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {site.status === 1 ? (
                                <FiCheckCircle className="w-4 h-4" />
                              ) : (
                                <FiMinusCircle className="w-4 h-4" />
                              )}
                              {site.status === 1 ? "Published" : "Draft"}
                            </span>
                            <span>{createdTime}</span>
                          </div>
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {/* Edit */}
                            <button
                              title="Edit Website"
                              onClick={() =>
                                window.open(
                                  `/ai-tools/web-builder/new-website?id=${site._id}`,
                                  "_blank"
                                )
                              }
                              className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:shadow-lg text-white text-sm font-medium px-3 py-2 rounded-md"
                            >
                              <FiEdit2 className="w-4 h-4" />
                              Edit Website
                            </button>
                            {/* Staging Preview */}
                            <button
                              title={
                                !hasWebsiteData
                                  ? "No Staging Preview Available"
                                  : "Preview Staging Website"
                              }
                              disabled={!hasWebsiteData}
                              onClick={() => handlePreviewStaging(site)}
                              className={`p-2 rounded-md transition-all flex items-center justify-center ${
                                hasWebsiteData
                                  ? "bg-[#2e2e2e] text-white hover:bg-[#3a3a3a]"
                                  : "bg-[#1a1a1a] text-gray-500 cursor-not-allowed opacity-60"
                              }`}
                            >
                              <FiEye
                                className={`w-4 h-4 ${
                                  hasWebsiteData
                                    ? "text-white"
                                    : "text-gray-600"
                                }`}
                              />
                            </button>

                            {/* Published Link (disabled if null) */}
                            <button
                              title={
                                isPublished
                                  ? "Preview Published Website"
                                  : "Website not published yet"
                              }
                              disabled={!isPublished}
                              onClick={() =>
                                isPublished &&
                                window.open(
                                  `${WEB_BUILDER_SERVICE_URL}${site.publishedLink}`,
                                  "_blank"
                                )
                              }
                              className={`p-2 rounded-md transition-all ${
                                isPublished
                                  ? "bg-[#2e2e2e] text-white hover:bg-[#3a3a3a]"
                                  : "bg-[#1a1a1a] text-gray-500 cursor-not-allowed opacity-60"
                              }`}
                            >
                              <FiGlobe className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <CreateWebsiteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreated={fetchWebsites}
          />
        </div>
      </main>
      {previewWebsite && <PreviewModal />}
    </DashboardLayout>
  );
};
export default WebBuilder;
