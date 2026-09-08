import { useEffect, useRef, useState, type FC } from "react";
import ReactDOMServer from "react-dom/server";
import StudioEditor from "@grapesjs/studio-sdk/react";
import {
  tableComponent,
  listPagesComponent,
  fsLightboxComponent,
  lightGalleryComponent,
  swiperComponent,
  iconifyComponent,
  accordionComponent,
  flexComponent,
  rteProseMirror,
  canvasEmptyState,
  canvasFullSize,
  canvasGridMode,
  youtubeAssetProvider,
  googleFontsAssetProvider,
  animationComponent,
} from "@grapesjs/studio-sdk-plugins";
// @ts-ignore: module has no type declarations for side-effect import
import "@grapesjs/studio-sdk/style";
import { useLocation, useNavigate } from "react-router-dom";
import WebBuilderService, {
  WebsiteProject,
  WebsiteVersion as WebsiteVersionType,
} from "../../services/web-builder/WebBuilderService";
import GalleryService from "../../services/web-builder/GalleryService";
import { imageGenService } from "../../services/imageGenService";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import TemplateService from "../../services/web-builder/TemplateService";
import { PREVIEW_DEVICE_SIZES } from "./config/previewDevices";
import LoadingSpinner from "../LoadingSpinner";
import { FaFileDownload } from "react-icons/fa";
import { MdDelete, MdClose, MdWebStories } from "react-icons/md";
// Backend API base URL
const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL || "";
const ICON_DOWNLOAD = ReactDOMServer.renderToStaticMarkup(
  <FaFileDownload size={18} color="#ccc" />
);
const ICON_DELETE = ReactDOMServer.renderToStaticMarkup(
  <MdDelete size={18} color="#dc2626" />
);
const ICON_CLOSE = ReactDOMServer.renderToStaticMarkup(
  <MdClose size={18} color="#ccc" />
);
const ICON_PAGES = ReactDOMServer.renderToStaticMarkup(
  <MdWebStories size={20} color="#ccc" />
);
import {
  cardPlugin,
  heroSectionPlugin,
  testimonialPlugin,
  featureBoxPlugin,
  pricingCardPlugin,
  imageGalleryPlugin,
  statsCardPlugin,
  ctaSectionPlugin,
  teamCardPlugin,
  faqItemPlugin,
  blogCardPlugin,
  alertBannerPlugin,
  headerPlugin,
  footerPlugin,
  sectionSeparatorPlugin,
  videoEmbedPlugin,
  contactFormPlugin,
  contactFormMinimalPlugin,
  contactFormSplitPlugin,
  socialLinksPlugin,
  breadcrumbPlugin,
  documentUploaderPlugin,
  documentUploaderCardPlugin,
  documentUploaderDropzonePlugin,
} from "./custom-components";

const WebsiteBuilderStudio: FC = () => {
  const normalizeDesktopMediaQueries = (html: string) => {
    if (!html) return html;
    const replaceIfWide = (_m: string, num: string) => {
      const n = parseInt(num, 10);
      return n >= 1200 ? "@media screen" : _m;
    };
    // Handle: @media (max-width: 1800px)
    let out = html.replace(
      /@media\s*\(\s*max-width\s*:\s*(\d+)px\s*\)/gi,
      replaceIfWide
    );
    // Handle: @media only screen and (max-width: 1800px)
    out = out.replace(
      /@media\s+(?:only\s+)?screen\s+and\s*\(\s*max-width\s*:\s*(\d+)px\s*\)/gi,
      replaceIfWide
    );
    return out;
  };

  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [websiteData, setWebsiteData] = useState<WebsiteProject | null>(null);
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  // Auto-save itself already existed (SDK storage manager) but had no
  // visible state at all — feedback.md explicitly asks for "show saved
  // state" alongside auto-save/undo/version history.
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Version history — didn't exist at all before (backend model had no
  // capacity for it, single overwritten websiteData blob). Rendered as a
  // plain React overlay rather than through the GrapesJS Studio SDK's own
  // declarative layout system — the SDK's icon-only toolbar buttons proved
  // difficult to target reliably even for automated testing, so anything
  // needing dependable interaction/verification goes here instead.
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState<WebsiteVersionType[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  // "Ask Ninja" — feedback.md asks for an always-visible control for
  // plain-English changes, plus AI Rewrite Section / AI Redesign Section /
  // AI Regenerate Image. websiteData is an unstructured GrapesJS blob with
  // no backend concept of "sections" (see plan.md 3.4), so this operates on
  // whatever's currently selected in the editor (or the whole page if
  // nothing is), rather than the backend identifying a section itself.
  // Rendered as a plain React overlay for the same reliability reasons as
  // the save-status/History UI above — an SDK sidebar button also can't be
  // "always visible" the way a floating control can.
  const [askNinjaOpen, setAskNinjaOpen] = useState(false);
  const [askNinjaInstruction, setAskNinjaInstruction] = useState("");
  const [askNinjaBusy, setAskNinjaBusy] = useState<
    "idle" | "rewrite" | "redesign" | "ask" | "image"
  >("idle");
  const [askNinjaSelection, setAskNinjaSelection] = useState<{ label: string; isImage: boolean } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const websiteId = params.get("id");

    // Validate ID
    if (!websiteId) {
      navigate("/ai-tools/web-builder", { replace: true });
      return;
    }

    // AuthProvider hydrates `user` from storage asynchronously — on a fresh
    // tab load (e.g. the wizard's window.open) this effect can fire before
    // it's populated. Previously this used an unguarded `user.id`, which
    // threw and bounced straight back to the dashboard; wait instead, same
    // fix as the dashboard's Recent Websites race.
    if (!user?.id) return;

    // Fetch website data
    const fetchWebsiteData = async () => {
      try {
        const response = await WebBuilderService.getWebsiteData(
          user.id,
          websiteId
        );

        if (response.success && response.data) {
          setWebsiteData(response.data);
        } else {
          console.error("Error:", response.message);
          navigate("/ai-tools/web-builder", { replace: true });
        }
      } catch (err) {
        console.error("Error fetching website data:", err);
        navigate("/ai-tools/web-builder", { replace: true });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };
    fetchWebsiteData();
  }, [location.search, user?.id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="medium" variant="dark" />
      </div>
    );
  }

  if (!websiteData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <h2 className="text-xl font-semibold text-gray-200">
          Website not found or unavailable....
        </h2>
      </div>
    );
  }

  const saveToServer = async (project: any) => {
    setSaveStatus("saving");
    try {
      const iframe = document.querySelector(".gjs-frame") as HTMLIFrameElement;
      if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
        toast.error("There is an issue when saving website");
        setSaveStatus("error");
        return;
      }

      const iframeWindow = iframe.contentWindow;
      const iframeBody = iframe.contentDocument.body;

      await new Promise((resolve) => {
        if (iframe?.contentDocument?.readyState === "complete")
          return resolve(true);
        iframe.contentWindow?.addEventListener("load", () => resolve(true));
      });

      iframeWindow.scrollTo(0, 0);

      setTimeout(async () => {
        const canvas = await html2canvas(iframeBody, {
          useCORS: true,
          backgroundColor: "#fff",
          scale: 1.5,
          width: iframeBody.scrollWidth,
          height: 700,
          windowWidth: iframeBody.scrollWidth,
          windowHeight: 700,
          x: 0,
          y: 0,
          scrollY: 0,
        });

        const screenshot = canvas.toDataURL("image/jpeg", 0.9);
        await handleSave(project, screenshot);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("There is an issue when saving website");
      setSaveStatus("error");
    }
  };

  const handleSave = async (project: any, websitePreview: string) => {
    try {
      const response = await WebBuilderService.saveWebsiteData(
        user.id,
        websiteData._id,
        project,
        websitePreview
      );

      if (response.success) {
        setSaveStatus("saved");
        setLastSavedAt(new Date());
        toast.success("Website saved successfully!");
      } else {
        setSaveStatus("error");
        toast.error(response.message);
      }
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
      toast.error("Failed to save website!");
    }
  };

  const openVersionHistory = async () => {
    setShowVersionHistory(true);
    setLoadingVersions(true);
    try {
      const response = await WebBuilderService.listVersions(user.id, websiteData._id);
      if (response.success) {
        setVersions(response.data || []);
      } else {
        toast.error(response.message || "Failed to load version history");
      }
    } catch (err) {
      toast.error("Failed to load version history");
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    setRestoringVersionId(versionId);
    try {
      const response = await WebBuilderService.restoreVersion(user.id, websiteData._id, versionId);
      if (response.success) {
        toast.success("Version restored — reloading editor...");
        // Simplest safe way to get the restored websiteData into the live
        // GrapesJS editor: reload, so the existing storage.onLoad path picks
        // it up fresh from the server, the same way it already does on a
        // normal page load. Manipulating the live SDK instance's loaded
        // project in place would be far more fragile.
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error(response.message || "Failed to restore version");
        setRestoringVersionId(null);
      }
    } catch (err) {
      toast.error("Failed to restore version");
      setRestoringVersionId(null);
    }
  };

  // Reads the current page's exported HTML with styles inlined (same export
  // path previewWebsite already uses) — optionally scoped to just one
  // component by temporarily tagging it with a unique marker attribute.
  // component.toHTML() alone isn't enough here: this project's style
  // manager writes class-based CSS rules (that's why previewWebsite needs
  // a dedicated "styles: inline" export step for the whole page), so a
  // single component's outerHTML on its own wouldn't carry its visual
  // styling — the model backing the AI edit needs to see actual styles.
  const extractHtmlForAiEdit = async (editor: any, selected: any): Promise<string> => {
    const marker = selected ? `ninja-ai-${Date.now()}` : null;
    if (selected && marker) {
      selected.setAttributes({ ...selected.getAttributes(), "data-ninja-ai-marker": marker });
    }
    try {
      const files = (await editor.runCommand("studio:projectFiles", {
        styles: "inline",
      })) as { name: string; mimeType: string; content: string; pageId?: string; page?: any }[];
      const Pages = editor.Pages;
      const selectedPage = Pages?.getSelected?.();
      const selectedPageId = selectedPage?.id || selectedPage?.getId?.();
      const htmlFile =
        files.find(
          (f) =>
            f.mimeType === "text/html" &&
            (f.pageId === selectedPageId ||
              f.page?.id === selectedPageId ||
              f.name?.includes?.(selectedPageId || ""))
        ) || files.find((f) => f.mimeType === "text/html");

      if (!htmlFile) return "";
      if (!marker) return htmlFile.content;

      const doc = new DOMParser().parseFromString(htmlFile.content, "text/html");
      const target = doc.querySelector(`[data-ninja-ai-marker="${marker}"]`);
      if (!target) return "";
      target.removeAttribute("data-ninja-ai-marker");
      return target.outerHTML;
    } finally {
      if (selected && marker) {
        const attrs = { ...selected.getAttributes() };
        delete attrs["data-ninja-ai-marker"];
        selected.setAttributes(attrs);
      }
    }
  };

  // Swaps AI-edited HTML back into the live component tree in place of
  // whatever was selected (preserving its position among its siblings), or
  // replaces the whole page when nothing was selected.
  const applyAiEditResult = (editor: any, selected: any, newHtml: string) => {
    const parent = selected?.parent?.();
    if (selected && parent) {
      const index = parent.components().indexOf(selected);
      selected.remove();
      const added = parent.components().add(newHtml, { at: index });
      const newComp = Array.isArray(added) ? added[0] : added;
      if (newComp) editor.select(newComp);
      return;
    }
    editor.setComponents(newHtml);
  };

  const runAskNinja = async (
    mode: "ask" | "rewrite" | "redesign",
    instructionOverride?: string
  ) => {
    const editor: any = editorRef.current;
    if (!editor) return;

    const instruction = (instructionOverride ?? askNinjaInstruction).trim();
    if (!instruction) {
      toast.error("Tell Ninja what to change first.");
      return;
    }

    const selected = editor.getSelected?.();
    setAskNinjaBusy(mode);
    try {
      const html = await extractHtmlForAiEdit(editor, selected);
      if (!html) {
        toast.error("Couldn't read that content — try selecting it again.");
        return;
      }

      const response = await WebBuilderService.aiEditSection(
        user.id,
        websiteData._id,
        html,
        instruction,
        mode
      );

      if (!response.success || !response.data?.html) {
        toast.error(response.message || "Ninja couldn't make that change.");
        return;
      }

      applyAiEditResult(editor, selected, response.data.html);
      try {
        editor.store();
      } catch (e) {}

      toast.success("Ninja applied your changes!");
      setAskNinjaInstruction("");
      setAskNinjaOpen(false);
    } catch (err) {
      console.error("Ask Ninja failed:", err);
      toast.error("Ninja couldn't make that change. Try again.");
    } finally {
      setAskNinjaBusy("idle");
    }
  };

  const handleRegenerateImage = async () => {
    const editor: any = editorRef.current;
    const selected = editor?.getSelected?.();
    if (!editor || !selected) return;

    const prompt =
      askNinjaInstruction.trim() ||
      selected.getAttributes?.()?.alt ||
      "A professional, high-quality image that fits this website's content and style";

    setAskNinjaBusy("image");
    try {
      const response = await imageGenService.generateImage({
        prompt,
        aspectRatio: "1:1",
        style: "photorealistic",
      });

      if (!response.success || !response.data?.imageUrl) {
        toast.error(response.message || "Image generation failed.");
        return;
      }

      const imageUrl = response.data.imageUrl;
      const tag = selected.get?.("tagName")?.toLowerCase?.();
      if (tag === "img") {
        selected.setAttributes({ ...selected.getAttributes(), src: imageUrl });
      } else {
        selected.addStyle({ "background-image": `url(${imageUrl})` });
      }

      try {
        editor.store();
      } catch (e) {}

      toast.success("New image generated!");
      setAskNinjaInstruction("");
      setAskNinjaOpen(false);
    } catch (err) {
      console.error("Regenerate image failed:", err);
      toast.error("Couldn't generate a new image. Try again.");
    } finally {
      setAskNinjaBusy("idle");
    }
  };

  const navigatetoHome = (_: any) => {

    navigate("/ai-tools/web-builder");
  };

  const deviceIcons: Record<string, string> = {
    desktop: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z" fill="currentColor"/></svg>`,
    tablet: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"></rect><path d="M11 18h2"></path></g></svg>`,
    mobile: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7 23q-.8 0-1.4-.6T5 21V3q0-.8.6-1.4T7 1h10q.8 0 1.4.6T19 3v3.1q.5.2.7.6t.3.8v2q0 .5-.3.8t-.7.6V21q0 .8-.6 1.4T17 23zm0-2h10V3H7zm0 0V3zm5-1q.4 0 .7-.3t.3-.7-.3-.7-.7-.3-.7.3-.3.7.3.7.7.3"></path></svg>`,
  };

  const addDeviceIcons = () => {
    const deviceButton = document.querySelector(
      ".gs-devices .gs-utl-card-title .gs-utl-truncate"
    ) as HTMLElement;
    if (deviceButton && !deviceButton.querySelector(".device-icon-inline")) {
      let deviceName = deviceButton.textContent?.trim().toLowerCase() || "";
      if (deviceName === "mobile portrait") {
        deviceButton.closest("li")?.remove();
        return;
      } else if (deviceName === "mobile landscape") {
        deviceButton.textContent = "Mobile";
        deviceName = "mobile";
      }
      const icon = deviceIcons[deviceName];
      if (icon) {
        const iconWrapper = document.createElement("div");
        iconWrapper.className = "device-icon-inline gs-cmp-icon";
        iconWrapper.innerHTML = icon;
        iconWrapper.style.display = "inline-flex";
        iconWrapper.style.alignItems = "center";
        iconWrapper.style.marginRight = "3px";
        iconWrapper.style.verticalAlign = "middle";
        deviceButton.style.display = "flex";
        deviceButton.style.alignItems = "center";
        deviceButton.style.gap = "3px";
        deviceButton.insertBefore(iconWrapper, deviceButton.firstChild);
      }
    }
    const deviceOptions = document.querySelectorAll('li[role="option"]');
    deviceOptions.forEach((option) => {
      const textDiv = option.querySelector(".gs-utl-truncate");
      if (!textDiv) return;
      let deviceName = textDiv.textContent?.trim().toLowerCase() || "";
      if (deviceName === "mobile portrait") {
        option.remove();
        return;
      }
      if (deviceName === "mobile landscape") {
        textDiv.textContent = "Mobile";
        deviceName = "mobile";
      }
      if (!option.querySelector(".device-icon-inline")) {
        const icon = deviceIcons[deviceName];
        if (icon) {
          const iconWrapper = document.createElement("div");
          iconWrapper.className = "device-icon-inline gs-cmp-icon";
          iconWrapper.innerHTML = icon;
          iconWrapper.style.marginRight = "3px";
          const parentDiv = textDiv.parentElement;
          parentDiv?.insertBefore(iconWrapper, textDiv);
        }
      }
    });
  };

  const previewWebsite = async (editor: any) => {
    const files = (await editor.runCommand("studio:projectFiles", {
      styles: "inline",
    })) as {
      name: string;
      mimeType: string;
      content: string;
      [key: string]: any;
    }[];
    // Try to resolve current page HTML, fallback to the first HTML file
    const Pages = editor.Pages;
    const selectedPage = Pages?.getSelected?.();
    const selectedPageId = selectedPage?.id || selectedPage?.getId?.();
    const findHtmlByPage = (pageId?: string) =>
      files.find(
        (f) =>
          f.mimeType === "text/html" &&
          (f.pageId === pageId ||
            f.page?.id === pageId ||
            f.name?.includes?.(pageId || ""))
      );
    const htmlFile =
      findHtmlByPage(selectedPageId) ||
      files.find((f) => f.mimeType === "text/html");
    const websiteHtml = htmlFile
      ? normalizeDesktopMediaQueries(htmlFile.content)
      : "";

    // Shared with the dashboard's PreviewModal (WebBuilder.tsx) so both
    // preview surfaces use identical breakpoints — they previously diverged
    // silently (mobile was 568-768px here vs 420-600px there). Widened back
    // to a string index here since the SDK's own button callbacks pass
    // loosely-typed device values, not the literal "desktop"|"tablet"|"mobile"
    // union.
    const deviceSizes: Record<string, { width: string; maxWidth: string }> =
      PREVIEW_DEVICE_SIZES;

    let currentDevice = previewDevice;

    const setActiveDeviceButton = (device: any) => {
      const all = document.querySelectorAll(".device-btn");
      all.forEach((btn) => {
        if (btn.classList.contains(`device-${device}`)) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    };

    const updatePreviewContent = (device: any) => {
      try {
        setPreviewDevice(device);
      } catch (e) {}
      currentDevice = device;

      const iframeContainer = document.querySelector(
        "[data-preview-container]"
      ) as HTMLElement;
      if (iframeContainer) {
        iframeContainer.style.width = deviceSizes[device].width;
        iframeContainer.style.maxWidth = deviceSizes[device].maxWidth;
      }

      setActiveDeviceButton(device);
    };

    const pageModels = Pages?.getAll?.() || [];
    let currentPage = Pages?.getSelected?.() || pageModels?.[0];

    const getHtmlForPage = (page: any) => {
      const pid = page?.id || page?.getId?.();
      const match = files.find(
        (f) =>
          f.mimeType === "text/html" &&
          (f.pageId === pid ||
            f.page?.id === pid ||
            f.name?.includes?.(pid || ""))
      );
      return match ? normalizeDesktopMediaQueries(match.content) : websiteHtml;
    };

    editor.runCommand("studio:layoutToggle", {
      id: "preview-website",
      header: false,
      placer: { type: "absolute", position: "center" },
      layout: {
        type: "column",
        style: {
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
        },
        children: [
          {
            type: "row",
            style: {
              padding: "12px 20px",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            },
            children: [
              {
                type: "button",
                icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round"/>
                                </svg>`,
                tooltip: "Close Preview",
                style: {
                  backgroundColor: "#3a3a3a",
                  padding: "8px 12px",
                  borderRadius: "6px",
                },
                onClick: ({ editor }: any) => {
                  editor.runCommand("studio:layoutRemove", {
                    id: "preview-website",
                  });
                },
              },
              {
                type: "row",
                style: { gap: "8px", alignItems: "center" },
                children: [
                  {
                    type: "text",
                    content: "Page:",
                    style: { color: "#ddd", fontSize: "12px" },
                  },
                  {
                    type: "select",
                    id: "preview-page-select",
                    options: pageModels.map((p: any) => ({
                      id: p.id || p.getId?.(),
                      label: p.getName?.() || p.get?.("name") || p.id,
                    })),
                    value: currentPage?.id || currentPage?.getId?.(),
                    style: { minWidth: "160px" },
                    onChange: ({ value }: any) => {
                      const page =
                        pageModels.find(
                          (p: any) => (p.id || p.getId?.()) === value
                        ) || currentPage;
                      currentPage = page;
                      const iframe = document.getElementById(
                        "preview-iframe"
                      ) as HTMLIFrameElement | null;
                      if (iframe) {
                        const html = getHtmlForPage(page);
                        iframe.srcdoc = html;
                      }
                    },
                  },
                ],
              },
              {
                type: "row",
                style: {
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                },
                children: [
                  {
                    type: "button",
                    className: `device-btn device-desktop ${
                      currentDevice === "desktop" ? "active" : ""
                    }`,
                    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z" fill="currentColor"/>
                                        </svg>`,
                    label: "Desktop",
                    tooltip: "Desktop View",
                    style: { padding: "8px 16px", borderRadius: "6px" },
                    onClick: () => updatePreviewContent("desktop"),
                  },
                  {
                    type: "button",
                    className: `device-btn device-tablet ${
                      currentDevice === "tablet" ? "active" : ""
                    }`,
                    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                                <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                                                <path d="M11 18h2"></path>
                                            </g>
                                        </svg>`,
                    label: "Tablet",
                    tooltip: "Tablet View",
                    style: { padding: "8px 16px", borderRadius: "6px" },
                    onClick: () => updatePreviewContent("tablet"),
                  },
                  {
                    type: "button",
                    className: `device-btn device-mobile ${
                      currentDevice === "mobile" ? "active" : ""
                    }`,
                    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="currentColor" d="M7 23q-.8 0-1.4-.6T5 21V3q0-.8.6-1.4T7 1h10q.8 0 1.4.6T19 3v18q0 .8-.6 1.4T17 23zm0-2h10V3H7zm5-1q.4 0 .7-.3t.3-.7-.3-.7-.7-.3-.7.3-.3.7.3.7.7.3"/>
                                        </svg>`,
                    label: "Mobile",
                    tooltip: "Mobile View",
                    style: { padding: "8px 16px", borderRadius: "6px" },
                    onClick: () => updatePreviewContent("mobile"),
                  },
                ],
              },
              { type: "row", style: { width: "44px" } },
            ],
          },
          {
            type: "row",
            style: {
              flex: 1,
              overflow: "auto",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "10px 20px 20px 20px",
              backgroundColor: "#1a1a1a",
            },
            children: [
              {
                type: "column",
                htmlAttrs: { "data-preview-container": true },
                style: {
                  width: deviceSizes.desktop.width,
                  maxWidth: deviceSizes.desktop.maxWidth,
                  height: "100%",
                  backgroundColor: "white",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  borderRadius: "8px",
                  overflow: "auto",
                  transition: "width 0.3s ease, max-width 0.3s ease",
                },
                children: [
                  {
                    type: "row",
                    as: "iframe",
                    id: "preview-iframe",
                    srcDoc: websiteHtml,
                    style: {
                      width: "100%",
                      height: "100%",
                      border: "none",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  };

  const publishWebsite = async (editor: any) => {
    editor.runCommand("studio:layoutToggle", {
      id: "publish-confirmation",
      header: false,
      placer: { type: "absolute", position: "center" },
      layout: {
        type: "column",
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 10000,
          backdropFilter: "blur(5px)",
        },
        children: [
          {
            type: "column",
            style: {
              // backgroundColor: '#1f1f1f',
              color: "#fff",
              padding: "30px 40px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "480px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              textAlign: "center",
              animation: "fadeIn 0.3s ease",
            },
            children: [
              {
                type: "text",
                content: "🚀 Ready to Publish Your Website?",
                style: {
                  fontSize: "22px",
                  fontWeight: "700",
                  marginBottom: "12px",
                },
              },
              {
                type: "text",
                content: `
                                We're about to host your website securely on our servers.
                                Once published, your site will be live and accessible to visitors.
                                You can republish anytime after making changes.
                            `,
                style: {
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#ccc",
                  marginBottom: "28px",
                },
              },
              {
                type: "row",
                style: {
                  justifyContent: "center",
                  gap: "16px",
                },
                children: [
                  {
                    type: "button",
                    label: "Close",
                    style: {
                      backgroundColor: "#374151",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      color: "#fff",
                      fontWeight: 600,
                      transition: "background 0.2s",
                    },
                    onClick: ({ editor }: any) => {
                      editor.runCommand("studio:layoutRemove", {
                        id: "publish-confirmation",
                      });
                    },
                  },
                  {
                    type: "button",
                    label: "Publish",
                    style: {
                      background:
                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                      padding: "10px 22px",
                      borderRadius: "8px",
                      color: "#fff",
                      fontWeight: 700,
                      boxShadow: "0 0 10px rgba(220,38,38,0.4)",
                      transition: "transform 0.2s ease",
                    },
                    onClick: async ({ editor }: any) => {
                      editor.runCommand("studio:layoutRemove", {
                        id: "publish-confirmation",
                      });
                      await handlePublishWebsite(editor);
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  };

  const handlePublishWebsite = async (editor: any) => {
    try {
      toast.loading("Publishing your website...", { id: "publish-loading" });

      const files = (await editor.runCommand("studio:projectFiles", {
        styles: "inline",
      })) as {
        name: string;
        mimeType: string;
        content: string;
        [key: string]: any;
      }[];

      const Pages = editor.Pages;
      const pageModels = Pages?.getAll?.() || [];

      const kebabCase = (str: string) =>
        (str || "")
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const getPageSlug = (page: any) => {
        const settings = page?.get?.("settings") || {};
        const slug = settings.slug || page?.get?.("slug");
        const name =
          page?.getName?.() ||
          page?.get?.("name") ||
          page?.id ||
          page?.getId?.();
        return slug || kebabCase(name);
      };

      const buildHtmlFor = (pid?: string) => {
        const f = files.find(
          (x) =>
            x.mimeType === "text/html" &&
            (x.pageId === pid ||
              x.page?.id === pid ||
              x.name?.includes?.(pid || ""))
        );
        return f?.content || "";
      };

      const filesPayload: { path: string; content: string }[] = [];
      const homePage = pageModels[0];
      const prevSelected = Pages?.getSelected?.();
      for (const p of pageModels) {
        const pid = p?.id || p?.getId?.();
        let raw = buildHtmlFor(pid);
        if (!raw) {
          try {
            Pages?.select?.(p);
            const pf = (await editor.runCommand("studio:projectFiles", {
              styles: "inline",
            })) as any[];
            const f2 = pf.find(
              (x) =>
                x.mimeType === "text/html" &&
                (x.pageId === pid ||
                  x.page?.id === pid ||
                  x.name?.includes?.(pid || ""))
            );
            raw = f2?.content || "";
          } catch (e) {}
        }
        if (!raw) {
          try {
            // Final fallback: render from editor APIs
            Pages?.select?.(p);
            const htmlRaw = editor.getHtml?.() || "";
            const cssRaw = editor.getCss?.() || "";
            if (htmlRaw) {
              raw = `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\"/>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n    <style>${cssRaw}</style>\n  </head>\n  <body style=\"margin:0;\">${htmlRaw}</body>\n</html>`;
            }
          } catch (e) {}
        }
        if (!raw) continue;
        const html = normalizeDesktopMediaQueries(raw);
        const isHome = p === homePage;
        const filename = isHome
          ? "index.html"
          : `${getPageSlug(p) || pid}.html`;
        filesPayload.push({ path: filename, content: html });
      }
      try {
        prevSelected && Pages?.select?.(prevSelected);
      } catch {}

      if (!filesPayload.length) {
        try {
          const htmlRaw = editor.getHtml?.() || "";
          const cssRaw = editor.getCss?.() || "";
          if (htmlRaw) {
            const one = `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\"/>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n    <style>${cssRaw}</style>\n  </head>\n  <body style=\"margin:0;\">${htmlRaw}</body>\n</html>`;
            filesPayload.push({
              path: "index.html",
              content: normalizeDesktopMediaQueries(one),
            });
          }
        } catch (e) {}
      }

      if (!filesPayload.length) {
        toast.error("No website content found to publish", {
          id: "publish-loading",
        });
        return;
      }

      let response: any = null;
      try {
        const authToken = (token || "").replace(/^"|"$/g, "");
        const res = await fetch(`${API_BASE}/website-builder/publish-website`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            userId: user.id,
            websiteId: websiteData._id,
            files: filesPayload,
          }),
        });
        response = await res.json();
      } catch (e) {
        // ignore
      }

      if (!response?.success) {
        // Legacy single-file fallback
        const first = filesPayload[0]?.content || "";
        response = await WebBuilderService.publishWebsite(
          user.id,
          websiteData._id,
          first
        );
      }

      if (response.success && response.data) {
        const isUpdate = response.data.isUpdate;
        toast.success(
          isUpdate
            ? "Website updated successfully!"
            : "Website published successfully!",
          { id: "publish-loading" }
        );

        window.open(response.data.fullUrl, "_blank");

        setWebsiteData((prev) =>
          prev
            ? {
                ...prev,
                publishedLink: response.data?.publishedUrl || "",
                status: 1,
              }
            : null
        );
      } else {
        toast.error(response.message || "Failed to publish website", {
          id: "publish-loading",
        });
      }
    } catch (error: any) {
      console.error("Publishing error:", error);
      toast.error(error?.message || "Failed to publish website", {
        id: "publish-loading",
      });
    }
  };

  // Custom Asset Manager Logic
  const customAssetManager = {
    // Upload assets to our custom storage
    onUpload: async ({ files }: { files: File[] }) => {
      try {
        toast.loading("Uploading assets...", { id: "upload-assets" });

        const uploadPromises = files.map((file) =>
          GalleryService.uploadAsset(file)
        );
        const results = await Promise.all(uploadPromises);

        const successfulUploads = results.filter((result) => result.success);
        const failedUploads = results.filter((result) => !result.success);

        if (successfulUploads.length > 0) {
          toast.success(`Assets uploaded successfully`, {
            id: "upload-assets",
          });
        }

        if (failedUploads.length > 0) {
          toast.error(`${failedUploads.length} asset(s) failed to upload`, {
            id: "upload-assets",
          });
        }

        // Return successful uploads in the format expected by GrapesJS
        return successfulUploads.map((result) => ({
          id: result.data?.id || "",
          src: result.data?.src || "",
          name: result.data?.name || "",
          mimeType: result.data?.mimeType || "",
          size: result.data?.size || 0,
        }));
      } catch (error) {
        console.error("Asset upload error:", error);
        toast.error("Failed to upload assets", { id: "upload-assets" });
        return [];
      }
    },

    // Delete assets from our custom storage
    onDelete: async ({ assets }: { assets: any[] }) => {
      try {
        const assetIds = assets
          .map((asset) => {
            const src = asset.getSrc();
            // Extract filename from URL like: http://localhost:3004/gallery/filename.jpg
            const filename = src.split("/").pop();
            return filename;
          })
          .filter(Boolean);

        if (assetIds.length === 0) return;

        toast.loading("Deleting assets...", { id: "delete-assets" });

        const response = await GalleryService.deleteMultipleAssets(assetIds);

        if (response.success) {
          toast.success(response.message, { id: "delete-assets" });
        } else {
          toast.error(response.message, { id: "delete-assets" });
        }
      } catch (error) {
        console.error("Asset deletion error:", error);
        toast.error("Failed to delete assets", { id: "delete-assets" });
      }
    },

    // Load assets from our custom storage
    onLoad: async () => {
      try {
        const response = await GalleryService.getUserAssets(1, 100);

        if (response.success && response.data) {
          return response.data.items.map((asset) => ({
            id: asset.id,
            src: asset.src,
            name: asset.name,
            type: asset.mimeType.startsWith("image/") ? "image" : "file",
            mimeType: asset.mimeType,
            size: asset.size,
          }));
        }

        return [];
      } catch (error) {
        console.error("Asset load error:", error);
        return [];
      }
    },
  };

  return (
    <div className="website-builder w-full h-dvh">
      <StudioEditor
        onReady={(editor: any) => {
          editorRef.current = editor;
          // Expose API base for runtime scripts
          // @ts-ignore
          (window as any).__API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          setTimeout(() => addDeviceIcons(), 200);

          editor.on("device:select", () => {
            setTimeout(() => addDeviceIcons(), 100);
          });

          // Keeps the Ask Ninja panel's "what am I editing" label in sync —
          // GrapesJS canvas selection changes don't otherwise trigger a
          // React re-render since editorRef is a plain ref, not state.
          const updateSelectionInfo = () => {
            const selected = editor.getSelected?.();
            if (!selected) {
              setAskNinjaSelection(null);
              return;
            }
            const tag = selected.get?.("tagName")?.toLowerCase?.() || "element";
            const bg = selected.getStyle?.()?.["background-image"];
            setAskNinjaSelection({
              label: tag,
              isImage: tag === "img" || (!!bg && bg !== "none"),
            });
          };
          editor.on("component:selected", updateSelectionInfo);
          editor.on("component:deselected", updateSelectionInfo);

          const observer = new MutationObserver(() => {
            addDeviceIcons();
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });

          // Wizard hand-off: Step 3's "Publish" button opens the editor with
          // this seeded draft already loaded and asks for one more explicit
          // confirmation here (publishWebsite just opens the existing
          // confirmation modal, it doesn't publish by itself) rather than
          // silently publishing a business's live site without them ever
          // seeing it.
          try {
            const params = new URLSearchParams(window.location.search);
            if (params.get("autopublish") === "1") {
              setTimeout(() => publishWebsite(editor), 800);
            }
          } catch {}
        }}
        options={{
          pages: {
            add: ({ editor, rename }: any) => {
              const page = editor.Pages.add(
                {
                  name: "New page",
                  component: "<div>New page</div>",
                },
                { select: true }
              );
              rename(page);
            },
            duplicate: ({ editor, page, rename }: any) => {
              const root = page.getMainComponent();
              const newPage = editor.Pages.add(
                {
                  name: `${page.getName()} (Copy)`,
                  component: root.clone(),
                },
                { select: true }
              );
              rename(newPage);
            },
            remove: ({ editor, page }: any) => {
              const { Pages } = editor;
              if (confirm("Are you sure you want to delete the page?")) {
                Pages.remove(page);
                const all = Pages.getAll();
                all && all[0] && Pages.select(all[0]);
              }
            },
            commandItems: ({ items }: any) => [
              ...items,
              {
                id: "set-as-home",
                label: "Set as Home",
                cmd: ({ editor, page }: any) => {
                  const { Pages } = editor;
                  const all = Pages.getAll();
                  const idx = all.findIndex(
                    (p: any) =>
                      (p.id || p.getId?.()) === (page.id || page.getId?.())
                  );
                  if (idx > 0) {
                    Pages.move(page, { at: 0 });
                    Pages.select(page);
                  }
                },
              },
            ],
            settings: true,
          },
          devices: {
            default: [
              {
                id: "desktop",
                name: "Desktop",
                width: "1200px",
              },
              {
                id: "tablet",
                name: "Tablet",
                width: "768px",
                widthMedia: "992px",
              },
              {
                id: "mobile",
                name: "Mobile",
                width: "568px",
                widthMedia: "768px",
              },
            ],
            selected: "desktop",
          },
          licenseKey:
            import.meta.env.VITE_WEBSITE_BUILDER_LICENSE_KEY,
          theme: "dark",
          customTheme: {
            default: {
              colors: {
                global: {
                  background1: "rgba(45, 45, 50, 1)",
                  background2: "rgba(35, 35, 40, 1)",
                  background3: "rgba(25, 25, 30, 1)",
                  backgroundHover: "rgba(55, 55, 60, 1)",
                  text: "rgba(220, 220, 230, 1)",
                  border: "rgba(46, 46, 52, 1)",
                  focus: "#ec2222",
                  placeholder: "rgba(140, 140, 150, 1)",
                },
                primary: {
                  background1: "#ec2222",
                  background3: "#a31515",
                  backgroundHover: "#c81010",
                  text: "rgba(255, 255, 255, 1)",
                },
                component: {
                  background1: "rgba(60, 70, 90, 1)",
                  background2: "rgba(50, 60, 80, 1)",
                  background3: "rgba(40, 50, 70, 1)",
                  text: "rgba(220, 220, 230, 1)",
                },
                selector: {
                  background1: "#ec2222",
                  background2: "#c81010",
                  text: "rgba(255, 255, 255, 1)",
                },
                symbol: {
                  background1: "#ec2222",
                  background2: "#c81010",
                  background3: "#a31515",
                  text: "rgba(255, 255, 255, 1)",
                },
              },
            },
          },
          fonts: {
            enableFontManager: true,
          },
          i18n: {
            locales: {
              en: {
                fontManager: {
                  addFontToProject: "Add font to project",
                  projectFonts: "Project fonts",
                  emptyProjectFonts: "There are no fonts in this project.",
                  selectFont: "Select a font",
                },
              },
            },
          },
          project: {
            type: "web",
            id: websiteData._id,
            default: {
              custom: {
                globalPageSettings: {
                  title: websiteData?.websiteTitle,
                  description: websiteData?.websiteDescription,
                  // slug?: string;
                  // title?: string;
                  // favicon?: string;
                  // description?: string;
                  // keywords?: string;
                  // socialTitle?: string;
                  // socialImage?: string;
                  // fonts?: Record<string, Font | InternalFont>;
                  // socialDescription?: string;
                  // customCodeHead?: string;
                  // customCodeBody?: string;
                },
              },
            },
          },
          layout: {
            default: {
              type: "column",
              style: { height: "100%" },
              children: [
                {
                  type: "row",
                  style: { flexGrow: 1 },
                  children: [
                    // Left sidebar column with custom buttons
                    {
                      type: "column",
                      className: "sidebar-column",
                      style: {
                        paddingTop: 20,
                        paddingBottom: 20,
                        paddingLeft: 10,
                        paddingRight: 10,
                        gap: 10,
                        borderRightWidth: "1px",
                        backgroundColor: "#1a1a1a",
                        minWidth: "60px",
                        alignItems: "center",
                      },
                      children: [
                        {
                          id: "add-blocks",
                          type: "button",
                          icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.58398 9H15.4173" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M9 2.58398V15.4173" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>`,
                          style: {
                            backgroundColor: "#ec2222",
                            padding: "6px 10px",
                          },
                          tooltip: "Add Blocks",
                          onClick: ({ editor }: any) => {
                            editor.runCommand("studio:layoutToggle", {
                              id: "blocks-panel",
                              header: false,
                              placer: {
                                type: "absolute",
                                position: "left",
                                title: "Add Blocks",
                                size: "l",
                              },
                              layout: {
                                type: "column",
                                style: {
                                  gap: 20,
                                  padding: 10,
                                  overflow: "auto",
                                },
                                children: [
                                  {
                                    type: "row",
                                    style: {
                                      padding: "10px 0",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      "Blocks",
                                      {
                                        type: "button",
                                        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="#fff" stroke-width="2"/><path d="M6 6L18 18" stroke="#fff" stroke-width="2"/></svg>',
                                        style: {
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                        },
                                        tooltip: "Close",
                                        onClick: ({ editor }: any) => {
                                          editor.runCommand(
                                            "studio:layoutRemove",
                                            { id: "blocks-panel" }
                                          );
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "panelBlocks",
                                    content: { itemsPerRow: 2 },
                                  },
                                ],
                              },
                            });
                          },
                        },
                        {
                          id: "add-blocks-label",
                          type: "text",
                          content: "Content",
                          style: {
                            fontSize: "9px",
                            color: "#888",
                            textAlign: "center",
                            marginTop: "-6px",
                          },
                        },
                        // Pages Button
                        {
                          id: "pages-manager",
                          type: "button",
                          icon: ICON_PAGES,
                          tooltip: "Pages",
                          onClick: ({ editor }) => {
                            editor.runCommand("studio:layoutToggle", {
                              id: "pages-panel",
                              header: false,
                              placer: {
                                type: "absolute",
                                position: "left",
                                title: "Pages",
                                size: "l",
                              },
                              layout: {
                                type: "column",
                                style: {
                                  gap: 20,
                                  padding: 10,
                                  overflow: "auto",
                                },
                                children: [
                                  {
                                    type: "row",
                                    style: {
                                      padding: "10px 0",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      "Pages",
                                      {
                                        type: "button",
                                        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="#fff" stroke-width="2"/><path d="M6 6L18 18" stroke="#fff" stroke-width="2"/></svg>',
                                        style: {
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                        },
                                        tooltip: "Close",
                                        onClick: ({ editor }: any) => {
                                          editor.runCommand(
                                            "studio:layoutRemove",
                                            {
                                              id: "pages-panel",
                                            }
                                          );
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "panelPages",
                                  },
                                ],
                              },
                            });
                          },
                        },
                        {
                          id: "pages-manager-label",
                          type: "text",
                          content: "Pages",
                          style: {
                            fontSize: "9px",
                            color: "#888",
                            textAlign: "center",
                            marginTop: "-6px",
                          },
                        },
                        // Layers Button
                        {
                          id: "openPanelButtonId",
                          type: "button",
                          icon: `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11 12L0 6L11 0L22 6L11 12ZM11 16L0.575 10.325L2.675 9.175L11 13.725L19.325 9.175L21.425 10.325L11 16ZM11 20L0.575 14.325L2.675 13.175L11 17.725L19.325 13.175L21.425 14.325L11 20ZM11 9.725L17.825 6L11 2.275L4.175 6L11 9.725Z" fill="#CCCCCC"/>
                                                    </svg>`,
                          tooltip: "Layers",
                          onClick: ({ editor }) => {
                            editor.runCommand("studio:layoutToggle", {
                              id: "layers-panel",
                              header: false,
                              placer: {
                                type: "absolute",
                                position: "left",
                                title: "Layers",
                                size: "l",
                              },
                              layout: {
                                type: "column",
                                style: {
                                  gap: 20,
                                  padding: 10,
                                  overflow: "auto",
                                },
                                children: [
                                  {
                                    type: "row",
                                    style: {
                                      padding: "10px 0",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      "Layers",
                                      {
                                        type: "button",
                                        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="#fff" stroke-width="2"/><path d="M6 6L18 18" stroke="#fff" stroke-width="2"/></svg>',
                                        style: {
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                        },
                                        tooltip: "Close",
                                        onClick: ({ editor }: any) => {
                                          editor.runCommand(
                                            "studio:layoutRemove",
                                            { id: "layers-panel" }
                                          );
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "panelLayers",
                                    content: { itemsPerRow: 2 },
                                  },
                                ],
                              },
                            });
                          },
                        },
                        // Global Styles Button
                        {
                          id: "global-styles-setting",
                          type: "button",
                          icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <mask id="mask0_1400_31139" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                    <rect width="24" height="24" fill="#D9D9D9"/>
                                                    </mask>
                                                    <g mask="url(#mask0_1400_31139)">
                                                    <path d="M8.8 10.95L10.95 8.775L9.55 7.35L8.45 8.45L7.05 7.05L8.125 5.95L7 4.825L4.825 7L8.8 10.95ZM17 19.175L19.175 17L18.05 15.875L16.95 16.95L15.55 15.55L16.625 14.45L15.2 13.05L13.05 15.2L17 19.175ZM7.25 21H3V16.75L7.375 12.375L2 7L7 2L12.4 7.4L16.175 3.6C16.375 3.4 16.6 3.25 16.85 3.15C17.1 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.875 3.4 19.075 3.6L20.4 4.95C20.6 5.15 20.75 5.375 20.85 5.625C20.95 5.875 21 6.13333 21 6.4C21 6.66667 20.95 6.92083 20.85 7.1625C20.75 7.40417 20.6 7.625 20.4 7.825L16.625 11.625L22 17L17 22L11.625 16.625L7.25 21ZM5 19H6.4L16.2 9.225L14.775 7.8L5 17.6V19Z" fill="#CCCCCC"/>
                                                    </g>
                                                    </svg>`,
                          tooltip: "Global Styles",
                          onClick: ({ editor }) => {
                            editor.runCommand("studio:layoutToggle", {
                              id: "global-styles-panel",
                              header: false,
                              placer: {
                                type: "absolute",
                                position: "left",
                                title: "Global Styles",
                                size: "l",
                              },
                              layout: {
                                type: "column",
                                style: {
                                  gap: 20,
                                  padding: 10,
                                  overflow: "auto",
                                },
                                children: [
                                  {
                                    type: "row",
                                    style: {
                                      padding: "10px 0",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      "Global Styles",
                                      {
                                        type: "button",
                                        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="#fff" stroke-width="2"/><path d="M6 6L18 18" stroke="#fff" stroke-width="2"/></svg>',
                                        style: {
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                        },
                                        tooltip: "Close",
                                        onClick: ({ editor }: any) => {
                                          editor.runCommand(
                                            "studio:layoutRemove",
                                            { id: "global-styles-panel" }
                                          );
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "panelGlobalStyles",
                                    content: { itemsPerRow: 1 },
                                  },
                                ],
                              },
                            });
                          },
                        },
                        {
                          id: "global-styles-label",
                          type: "text",
                          content: "Design",
                          style: {
                            fontSize: "9px",
                            color: "#888",
                            textAlign: "center",
                            marginTop: "-6px",
                          },
                        },
                        {
                          id: "openAssetsButtonId",
                          type: "button",
                          icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7 12H17L13.55 7.5L11.25 10.5L9.7 8.5L7 12ZM6 16C5.45 16 4.97917 15.8042 4.5875 15.4125C4.19583 15.0208 4 14.55 4 14V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H6ZM6 14H18V2H6V14ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4H2V18H16V20H2Z" fill="#CCCCCC"/>
                                                    </svg>`,
                          tooltip: "Open Assets Library",
                          onClick: ({ editor }) => {
                            editor.runCommand("studio:layoutToggle", {
                              id: "assets-panel",
                              header: false,
                              placer: {
                                type: "absolute",
                                position: "left",
                                title: "Assets",
                                size: "l",
                              },
                              layout: {
                                type: "column",
                                style: {
                                  gap: 20,
                                  padding: 10,
                                  overflow: "auto",
                                },
                                children: [
                                  {
                                    type: "row",
                                    style: {
                                      padding: "10px 0",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      "Assets Library",
                                      {
                                        type: "button",
                                        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="#fff" stroke-width="2"/><path d="M6 6L18 18" stroke="#fff" stroke-width="2"/></svg>',
                                        style: {
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                        },
                                        tooltip: "Close",
                                        onClick: ({ editor }: any) => {
                                          editor.runCommand(
                                            "studio:layoutRemove",
                                            {
                                              id: "assets-panel",
                                            }
                                          );
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "panelAssets",
                                    content: {
                                      itemsPerRow: 2, // Shows 2 assets per row
                                    },
                                  },
                                ],
                              },
                            });
                          },
                        },
                        {
                          id: "openTemplatesButtonId",
                          type: "button",
                          tooltip: "Select Templates",
                          icon: '<svg viewBox="0 0 24 24"><path d="M20 14H6C3.8 14 2 15.8 2 18S3.8 22 6 22H20C21.1 22 22 21.1 22 20V16C22 14.9 21.1 14 20 14M6 20C4.9 20 4 19.1 4 18S4.9 16 6 16 8 16.9 8 18 7.1 20 6 20M6.3 12L13 5.3C13.8 4.5 15 4.5 15.8 5.3L18.6 8.1C19.4 8.9 19.4 10.1 18.6 10.9L17.7 12H6.3M2 13.5V4C2 2.9 2.9 2 4 2H8C9.1 2 10 2.9 10 4V5.5L2 13.5Z" /></svg>',
                          onClick: ({ editor }) => {
                            editor.runCommand("studio:layoutToggle", {
                              id: "templates-panel",
                              header: false,
                              placer: {
                                type: "absolute",
                                position: "left",
                                title: "Templates",
                                size: "l",
                              },
                              layout: {
                                type: "column",
                                style: {
                                  gap: 20,
                                  padding: 10,
                                  overflow: "auto",
                                },
                                children: [
                                  {
                                    type: "row",
                                    style: {
                                      padding: "10px 0",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      "Templates",
                                      {
                                        type: "button",
                                        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="#fff" stroke-width="2"/><path d="M6 6L18 18" stroke="#fff" stroke-width="2"/></svg>',
                                        style: {
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                        },
                                        tooltip: "Close",
                                        onClick: ({ editor }: any) => {
                                          editor.runCommand(
                                            "studio:layoutRemove",
                                            {
                                              id: "templates-panel",
                                            }
                                          );
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "panelTemplates",
                                    content: {
                                      itemsPerRow: 1,
                                    },
                                    onSelect: ({
                                      loadTemplate,
                                      template,
                                      editor,
                                    }: any) => {
                                      loadTemplate(template);
                                      editor.runCommand("studio:layoutRemove", {
                                        id: "templates-panel",
                                      });
                                    },
                                  },
                                ],
                              },
                            });
                          },
                        },
                        // Home Button
                        {
                          id: "home-redirect",
                          type: "button",
                          icon: `<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M0 18V6L8 0L16 6V18H0ZM2 16H14V7L8 2.5L2 7V16Z" fill="#CCCCCC"/>
                                                    </svg>`,
                          tooltip: "Home",
                          onClick: ({ editor }) => {
                            navigatetoHome(editor);
                          },
                        },
                        // Settings Button (Global Global Settings)
                        {
                          id: "global-setting",
                          type: "button",
                          icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.48073 19.1654L7.11406 16.232C6.91545 16.1556 6.7283 16.064 6.5526 15.957C6.37691 15.8501 6.20503 15.7355 6.03698 15.6133L3.3099 16.7591L0.789062 12.4049L3.14948 10.6174C3.1342 10.5105 3.12656 10.4074 3.12656 10.3081V9.68932C3.12656 9.59002 3.1342 9.48689 3.14948 9.37995L0.789062 7.59245L3.3099 3.23828L6.03698 4.38411C6.20503 4.26189 6.38073 4.14731 6.56406 4.04036C6.7474 3.93342 6.93073 3.84175 7.11406 3.76536L7.48073 0.832031H12.5224L12.8891 3.76536C13.0877 3.84175 13.2748 3.93342 13.4505 4.04036C13.6262 4.14731 13.7981 4.26189 13.9661 4.38411L16.6932 3.23828L19.2141 7.59245L16.8536 9.37995C16.8689 9.48689 16.8766 9.59002 16.8766 9.68932V10.3081C16.8766 10.4074 16.8613 10.5105 16.8307 10.6174L19.1911 12.4049L16.6703 16.7591L13.9661 15.6133C13.7981 15.7355 13.6224 15.8501 13.4391 15.957C13.2557 16.064 13.0724 16.1556 12.8891 16.232L12.5224 19.1654H7.48073ZM9.0849 17.332H10.8953L11.2161 14.9029C11.6898 14.7806 12.129 14.6011 12.5339 14.3643C12.9387 14.1275 13.3092 13.8411 13.6453 13.5049L15.9141 14.4445L16.8078 12.8862L14.837 11.3966C14.9134 11.1827 14.9668 10.9574 14.9974 10.7206C15.028 10.4838 15.0432 10.2431 15.0432 9.9987C15.0432 9.75425 15.028 9.51363 14.9974 9.27682C14.9668 9.04002 14.9134 8.81467 14.837 8.60078L16.8078 7.1112L15.9141 5.55286L13.6453 6.51536C13.3092 6.16398 12.9387 5.86988 12.5339 5.63307C12.129 5.39627 11.6898 5.21675 11.2161 5.09453L10.9182 2.66536H9.10781L8.78698 5.09453C8.31337 5.21675 7.87413 5.39627 7.46927 5.63307C7.06441 5.86988 6.69392 6.15634 6.35781 6.49245L4.08906 5.55286L3.19531 7.1112L5.16615 8.57786C5.08976 8.80703 5.03628 9.0362 5.00573 9.26536C4.97517 9.49453 4.9599 9.73898 4.9599 9.9987C4.9599 10.2431 4.97517 10.4799 5.00573 10.7091C5.03628 10.9383 5.08976 11.1674 5.16615 11.3966L3.19531 12.8862L4.08906 14.4445L6.35781 13.482C6.69392 13.8334 7.06441 14.1275 7.46927 14.3643C7.87413 14.6011 8.31337 14.7806 8.78698 14.9029L9.0849 17.332ZM10.0474 13.207C10.9335 13.207 11.6898 12.8938 12.3161 12.2674C12.9425 11.6411 13.2557 10.8848 13.2557 9.9987C13.2557 9.11259 12.9425 8.35634 12.3161 7.72995C11.6898 7.10356 10.9335 6.79036 10.0474 6.79036C9.14601 6.79036 8.38594 7.10356 7.76719 7.72995C7.14844 8.35634 6.83906 9.11259 6.83906 9.9987C6.83906 10.8848 7.14844 11.6411 7.76719 12.2674C8.38594 12.8938 9.14601 13.207 10.0474 13.207Z" fill="#CCCCCC"/>
                                                    </svg>`,
                          tooltip: "Global Settings",
                          onClick: ({ editor }) => {
                            editor.runCommand("studio:layoutToggle", {
                              id: "page-settings-panel",
                              header: false,
                              placer: {
                                type: "absolute",
                                position: "left",
                                title: "Global Settings",
                                size: "l",
                              },
                              layout: {
                                type: "column",
                                style: {
                                  gap: 20,
                                  padding: 10,
                                  overflow: "auto",
                                },
                                children: [
                                  {
                                    type: "row",
                                    style: {
                                      padding: "10px 0",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      "Global Settings",
                                      {
                                        type: "button",
                                        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="#fff" stroke-width="2"/><path d="M6 6L18 18" stroke="#fff" stroke-width="2"/></svg>',
                                        style: {
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                        },
                                        tooltip: "Close",
                                        onClick: ({ editor }: any) => {
                                          editor.runCommand(
                                            "studio:layoutRemove",
                                            { id: "page-settings-panel" }
                                          );
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "panelPageSettings",
                                    content: { itemsPerRow: 1 },
                                  },
                                ],
                              },
                            });
                          },
                        },
                        {
                          id: "global-setting-label",
                          type: "text",
                          content: "Settings",
                          style: {
                            fontSize: "9px",
                            color: "#888",
                            textAlign: "center",
                            marginTop: "-6px",
                          },
                        },
                        // Advanced Button — surfaces the code view (raw
                        // HTML/CSS export), which existed in the SDK but was
                        // fully switched off (display:none + its trigger
                        // commented out) rather than organized as an
                        // explicit "Advanced" area the way feedback.md asks
                        // for. Also houses "Animate Selected" (previously a
                        // top-toolbar button) since detailed animation
                        // settings are the other thing feedback.md names as
                        // belonging here.
                        {
                          id: "advanced-panel",
                          type: "button",
                          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6z" fill="#CCCCCC"/>
                                                    </svg>`,
                          tooltip: "Advanced",
                          onClick: ({ editor }: any) => {
                            editor.runCommand("studio:layoutToggle", {
                              id: "advanced-panel-content",
                              header: false,
                              placer: {
                                type: "absolute",
                                position: "left",
                                title: "Advanced",
                                size: "l",
                              },
                              layout: {
                                type: "column",
                                style: { gap: 20, padding: 10, overflow: "auto" },
                                children: [
                                  {
                                    type: "row",
                                    style: {
                                      padding: "10px 0",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      "Advanced",
                                      {
                                        type: "button",
                                        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="#fff" stroke-width="2"/><path d="M6 6L18 18" stroke="#fff" stroke-width="2"/></svg>',
                                        style: { background: "none", border: "none", cursor: "pointer", marginLeft: "10px" },
                                        tooltip: "Close",
                                        onClick: ({ editor }: any) => {
                                          editor.runCommand("studio:layoutRemove", { id: "advanced-panel-content" });
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "text",
                                    content: "For code-level and animation changes — most people won't need this.",
                                    style: { color: "#888", fontSize: "12px", marginBottom: "8px" },
                                  },
                                  {
                                    type: "button",
                                    label: "View / Edit Code (HTML & CSS)",
                                    style: {
                                      backgroundColor: "#252525",
                                      border: "1px solid #333",
                                      borderRadius: "8px",
                                      padding: "10px 14px",
                                      color: "#fff",
                                      width: "100%",
                                    },
                                    onClick: ({ editor }: any) => {
                                      editor.runCommand("studio:layoutRemove", { id: "advanced-panel-content" });
                                      // No direct command string opens this — the SDK's
                                      // stock code-view button is still rendered, just
                                      // display:none'd (see the rightContainer.buttons
                                      // filter below), so the proven way to trigger it
                                      // is the same DOM click this app already used
                                      // before that button was hidden.
                                      const importButton = document.querySelector(
                                        ".importcode-btn button"
                                      ) as HTMLElement | null;
                                      importButton?.click();
                                    },
                                  },
                                  {
                                    type: "text",
                                    content:
                                      "Animation controls are still on the main toolbar (the ✦ icon) — select an element first, then click it there.",
                                    style: { color: "#666", fontSize: "11px", marginTop: "4px" },
                                  },
                                ],
                              },
                            });
                          },
                        },
                      ],
                    },
                    // Main canvas area with top sidebar
                    {
                      type: "column",
                      className: "topbar-column",
                      style: { flexGrow: 1 },
                      children: [
                        {
                          type: "canvasSidebarTop",
                          sidebarTop: {
                            leftContainer: {
                              buttons: () => [
                                // Code button commented out by request (shows import code popup and code view)
                                /*
                                {
                                  id: "code-show-btn",
                                  type: "button",
                                  variant: "outline",
                                  icon: `<svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M6 12L0 6L6 0L7.425 1.425L2.825 6.025L7.4 10.6L6 12ZM14 12L12.575 10.575L17.175 5.975L12.6 1.4L14 0L20 6L14 12Z" fill="#CCCCCC"/>
                                                                    </svg>`,
                                  label: "Code",
                                  style: {
                                    backgroundColor: "#181818",
                                    padding: "10px 15px",
                                    borderRadius: "8px",
                                  },
                                  onClick: () => {
                                    const importButton = document.querySelector(
                                      ".importcode-btn button"
                                    ) as HTMLElement;
                                    if (importButton) {
                                      const attributes: Record<string, string> = {};
                                      for (const attr of importButton.attributes) {
                                        attributes[attr.name] = attr.value;
                                      }

                                      importButton.click();
                                    } else {
                                      console.error("Import code button not found");
                                    }
                                  },
                                },
                                */
                              ],
                            },
                            rightContainer: {
                              buttons: ({ items }) => {
                                const desiredButtons = [
                                  "store",
                                  "fullscreen",
                                  "undo",
                                  "redo",
                                  "showImportCode",
                                ];
                                const filtered = items
                                  .filter((item) =>
                                    desiredButtons.includes(item.id)
                                  )
                                  .map((item) => {
                                    if (item.id === "showImportCode") {
                                      return {
                                        ...item,
                                        className: "importcode-btn",
                                        style: { display: "none" },
                                      };
                                    }
                                    return item;
                                  });

                                // Add preview button
                                return [
                                  ...filtered,
                                  {
                                    type: "button",
                                    id: "documents-panel-btn",
                                    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#CCCCCC" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="#CCCCCC" stroke-width="2" stroke-linejoin="round"/></svg>`,
                                    tooltip: "View Uploaded Documents",
                                    onClick: async ({ editor }) => {
                                      const authToken = (token || "").replace(
                                        /^"|"$/g,
                                        ""
                                      );
                                      const withAuth = (
                                        opts: RequestInit = {}
                                      ) => ({
                                        ...opts,
                                        headers: {
                                          ...(opts.headers || {}),
                                          ...(authToken
                                            ? {
                                                Authorization: `Bearer ${authToken}`,
                                              }
                                            : {}),
                                        },
                                      });
                                      const apiFetch = (
                                        path: string,
                                        opts?: RequestInit
                                      ) =>
                                        fetch(
                                          `${API_BASE}${path}`,
                                          withAuth(opts)
                                        );
                                      const siteId = websiteData?._id;
                                      let items: any[] = [];
                                      try {
                                        const res = await apiFetch(
                                          `/website-builder/uploads/documents?websiteId=${siteId}`
                                        );
                                        if (res.ok) {
                                          const json = await res.json();
                                          if (json?.success)
                                            items = json.data?.items || [];
                                        }
                                      } catch (e) {}

                                      const rows = items.map((it: any) => ({
                                        type: "row",
                                        htmlAttrs: { id: `doc-row-${it.id}` },
                                        style: {
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          padding: "10px 0",
                                          borderBottom: "1px solid #333",
                                        },
                                        children: [
                                          {
                                            type: "text",
                                            content: `${it.name}`,
                                            style: {
                                              flex: 1,
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap",
                                            },
                                          },
                                          {
                                            type: "row",
                                            style: {
                                              gap: "8px",
                                              alignItems: "center",
                                            },
                                            children: [
                                              {
                                                type: "button",
                                                tooltip: "Download",
                                                style: {
                                                  background: "transparent",
                                                  padding: "6px",
                                                },
                                                icon: ICON_DOWNLOAD,
                                                onClick: async () => {
                                                  try {
                                                    const r = await apiFetch(
                                                      `/website-builder/uploads/documents/${it.id}/download`
                                                    );
                                                    if (!r.ok)
                                                      throw new Error(
                                                        "download failed"
                                                      );
                                                    const blob = await r.blob();
                                                    const url =
                                                      URL.createObjectURL(blob);
                                                    const a =
                                                      document.createElement(
                                                        "a"
                                                      );
                                                    a.href = url;
                                                    a.download =
                                                      it.name || "document";
                                                    document.body.appendChild(
                                                      a
                                                    );
                                                    a.click();
                                                    a.remove();
                                                    URL.revokeObjectURL(url);
                                                  } catch {}
                                                },
                                              },
                                              {
                                                type: "button",
                                                tooltip: "Delete",
                                                style: {
                                                  background: "transparent",
                                                  padding: "6px",
                                                },
                                                icon: ICON_DELETE,
                                                onClick: async () => {
                                                  try {
                                                    const r = await apiFetch(
                                                      `/website-builder/uploads/documents/${it.id}`,
                                                      { method: "DELETE" }
                                                    );
                                                    if (
                                                      !(
                                                        r.status === 204 || r.ok
                                                      )
                                                    )
                                                      throw new Error(
                                                        "delete failed"
                                                      );
                                                    // Show success and refresh the list without closing the panel
                                                    toast.success(
                                                      "Document deleted successfully"
                                                    );
                                                    // Remove row immediately
                                                    const row =
                                                      document.getElementById(
                                                        `doc-row-${it.id}`
                                                      );
                                                    if (
                                                      row &&
                                                      row.parentElement
                                                    )
                                                      row.parentElement.removeChild(
                                                        row
                                                      );
                                                    // Update total count
                                                    const totalEl =
                                                      document.getElementById(
                                                        "doc-total-count"
                                                      );
                                                    if (totalEl) {
                                                      const m =
                                                        totalEl.textContent?.match(
                                                          /\d+/
                                                        );
                                                      const n = m
                                                        ? Math.max(
                                                            0,
                                                            parseInt(m[0]) - 1
                                                          )
                                                        : 0;
                                                      totalEl.textContent = `Total: ${n}`;
                                                    }
                                                  } catch {}
                                                },
                                              },
                                            ],
                                          },
                                        ],
                                      }));

                                      editor.runCommand("studio:layoutToggle", {
                                        id: "documents-panel",
                                        header: false,
                                        placer: {
                                          type: "absolute",
                                          position: "left",
                                          title: "Documents",
                                          size: "l",
                                        },
                                        layout: {
                                          type: "column",
                                          style: {
                                            gap: "12px",
                                            padding: "12px",
                                            overflow: "auto",
                                          },
                                          children: [
                                            {
                                              type: "row",
                                              style: {
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingBottom: "6px",
                                                borderBottom: "1px solid #333",
                                              },
                                              children: [
                                                {
                                                  type: "text",
                                                  content: "Uploaded Documents",
                                                  style: {
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                  },
                                                },
                                                {
                                                  type: "button",
                                                  tooltip: "Close",
                                                  style: {
                                                    background: "transparent",
                                                    padding: "6px",
                                                  },
                                                  icon: ICON_CLOSE,
                                                  onClick: ({
                                                    editor,
                                                  }: any) => {
                                                    editor.runCommand(
                                                      "studio:layoutRemove",
                                                      { id: "documents-panel" }
                                                    );
                                                  },
                                                },
                                              ],
                                            },
                                            ...(rows.length
                                              ? rows
                                              : [
                                                  {
                                                    type: "text",
                                                    content: authToken
                                                      ? "No documents uploaded yet."
                                                      : "Not authorized. Please sign in again.",
                                                    style: {
                                                      color: "#aaa",
                                                      padding: "8px 0",
                                                    },
                                                  },
                                                ]),
                                            {
                                              type: "row",
                                              style: {
                                                justifyContent: "flex-end",
                                                paddingTop: "8px",
                                              },
                                              children: [
                                                {
                                                  type: "text",
                                                  htmlAttrs: {
                                                    id: "doc-total-count",
                                                  },
                                                  content: `Total: ${items.length}`,
                                                  style: { color: "#aaa" },
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      });
                                    },
                                  },
                                  {
                                    type: "button",
                                    id: "wrap-animate-btn",
                                    tooltip: "Animate Selected",
                                    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#CCCCCC"/></svg>`,
                                    onClick: ({ editor }) => {
                                      const selected = editor.getSelected?.();
                                      if (!selected) return;
                                      try {
                                        editor.runCommand?.(
                                          "core:component-wrap",
                                          {
                                            component: selected,
                                            wrapper: { type: "animation" },
                                          }
                                        );
                                      } catch (e) {}
                                    },
                                  },
                                  {
                                    type: "button",
                                    id: "preview-stg-btn",
                                    icon: `<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M1.53688 13.022C0.871153 13.4456 0 12.9674 0 12.1783V1.82167C0 1.03258 0.87115 0.554368 1.53688 0.978012L9.67424 6.15634C10.2917 6.54929 10.2917 7.45071 9.67425 7.84366L1.53688 13.022ZM2 10.35L7.25 7L4.5 8.75476L2 10.35Z" fill="#CCCCCC"/>
                                                                        </svg>`,
                                    tooltip: "Preview Website",
                                    onClick: ({ editor }) => {
                                      previewWebsite(editor);
                                    },
                                  },
                                  {
                                    type: "button",
                                    id: "publish-btn",
                                    label: "Publish",
                                    tooltip: "Publish Website",
                                    style: {
                                      background:
                                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                                      padding: "8px 15px",
                                      borderRadius: 8,
                                      fontWeight: 600,
                                    },
                                    onClick: ({ editor }) => {
                                      publishWebsite(editor);
                                    },
                                  },
                                ];
                              },
                            },
                          },
                        },
                      ],
                    },
                    { type: "sidebarRight" },
                  ],
                },
              ],
            },
          },
          globalStyles: {
            default: [
              // ==================== Colors Section ====================
              {
                id: "varPrimary",
                property: "--color-primary",
                field: "color",
                selector: ":root",
                label: "Primary",
                defaultValue: "#cf549e",
                category: { id: "colors", label: "Colors", open: true },
              },
              {
                id: "varSecondary",
                property: "--color-secondary",
                field: "color",
                selector: ":root",
                label: "Secondary",
                defaultValue: "#b9227d",
                category: { id: "colors" },
              },
              {
                id: "varAccent",
                property: "--color-accent",
                field: "color",
                selector: ":root",
                label: "Accent",
                defaultValue: "#ffb347",
                category: { id: "colors" },
              },
              {
                id: "varSuccess",
                property: "--color-success",
                field: "color",
                selector: ":root",
                label: "Success",
                defaultValue: "#28a745",
                category: { id: "colors" },
              },
              {
                id: "varWarning",
                property: "--color-warning",
                field: "color",
                selector: ":root",
                label: "Warning",
                defaultValue: "#ffc107",
                category: { id: "colors" },
              },
              {
                id: "varError",
                property: "--color-error",
                field: "color",
                selector: ":root",
                label: "Error",
                defaultValue: "#dc3545",
                category: { id: "colors" },
              },

              // ==================== Body Section ====================
              {
                id: "bodyBackground",
                property: "background-color",
                field: "color",
                selector: "body",
                label: "Background",
                defaultValue: "inherit",
                category: { id: "body", label: "Body", open: false },
              },
              {
                id: "bodyColor",
                property: "color",
                field: "color",
                selector: "body",
                label: "Color",
                defaultValue: "inherit",
                category: { id: "body" },
              },
              {
                id: "bodyFontSize",
                property: "font-size",
                field: {
                  type: "number",
                  min: 0.5,
                  max: 3,
                  step: 0.1,
                  units: ["rem", "px", "em"],
                },
                selector: "body",
                label: "Font Size",
                defaultValue: "1rem",
                category: { id: "body" },
              },
              {
                id: "bodyLineHeight",
                property: "line-height",
                field: {
                  type: "number",
                  min: 1,
                  max: 3,
                  step: 0.1,
                  units: ["", "rem", "px"],
                },
                selector: "body",
                label: "Line Height",
                defaultValue: "1.75rem",
                category: { id: "body" },
              },
              {
                id: "bodyFontFamily",
                property: "font-family",
                field: {
                  type: "select",
                  options: [
                    { id: "Arial, sans-serif", label: "Arial" },
                    { id: "Georgia, serif", label: "Georgia" },
                    {
                      id: '"Times New Roman", serif',
                      label: "Times New Roman",
                    },
                    { id: '"Courier New", monospace', label: "Courier New" },
                    { id: "Verdana, sans-serif", label: "Verdana" },
                    { id: "inherit", label: "Default" },
                  ],
                },
                selector: "body",
                label: "Font Family",
                defaultValue: "Arial, sans-serif",
                category: { id: "body" },
              },

              // ==================== Heading Section ====================
              {
                id: "headingColor",
                property: "color",
                field: "color",
                selector: "h1, h2, h3, h4, h5, h6",
                label: "Color",
                defaultValue: "var(--gjs-t-color)",
                category: { id: "heading", label: "Heading", open: false },
              },
              {
                id: "headingFontSize",
                property: "font-size",
                field: {
                  type: "number",
                  min: 1,
                  max: 5,
                  step: 0.1,
                  units: ["rem", "px", "em"],
                },
                selector: "h1",
                label: "Font Size",
                defaultValue: "1.5rem",
                category: { id: "heading" },
              },
              {
                id: "headingLineHeight",
                property: "line-height",
                field: {
                  type: "number",
                  min: 1,
                  max: 3,
                  step: 0.1,
                  units: ["", "rem", "px"],
                },
                selector: "h1",
                label: "Line Height",
                defaultValue: "2.5rem",
                category: { id: "heading" },
              },
              {
                id: "headingFontFamily",
                property: "font-family",
                field: {
                  type: "select",
                  options: [
                    { id: "inherit", label: "Default" },
                    { id: "Arial, sans-serif", label: "Arial" },
                    { id: "Georgia, serif", label: "Georgia" },
                    {
                      id: '"Times New Roman", serif',
                      label: "Times New Roman",
                    },
                    { id: "Verdana, sans-serif", label: "Verdana" },
                  ],
                },
                selector: "h1, h2, h3, h4, h5, h6",
                label: "Font Family",
                defaultValue: "inherit",
                category: { id: "heading" },
              },

              // ==================== Subheading Section ====================
              {
                id: "subheadingColor",
                property: "color",
                field: "color",
                selector: "h2",
                label: "Color",
                defaultValue: "#601843",
                category: {
                  id: "subheading",
                  label: "Subheading",
                  open: false,
                },
              },
              {
                id: "subheadingFontSize",
                property: "font-size",
                field: {
                  type: "number",
                  min: 0.5,
                  max: 4,
                  step: 0.1,
                  units: ["rem", "px", "em"],
                },
                selector: "h2",
                label: "Font Size",
                defaultValue: "1.2rem",
                category: { id: "subheading" },
              },
              {
                id: "subheadingLineHeight",
                property: "line-height",
                field: {
                  type: "number",
                  min: 1,
                  max: 3,
                  step: 0.05,
                  units: ["", "rem", "px"],
                },
                selector: "h2",
                label: "Line Height",
                defaultValue: "1.75",
                category: { id: "subheading" },
              },

              // ==================== Button Section (Optional) ====================
              {
                id: "btnColor",
                property: "background-color",
                field: "color",
                selector: ".btn-primary, button",
                label: "Primary button color",
                defaultValue: "var(--color-primary)",
                category: { id: "buttons", label: "Buttons", open: false },
              },
              {
                id: "btnRadius",
                property: "border-radius",
                field: {
                  type: "select",
                  options: [
                    { id: "0", label: "None" },
                    { id: "0.25rem", label: "Small" },
                    { id: "0.5rem", label: "Default" },
                    { id: "1rem", label: "Large" },
                    { id: "10rem", label: "Full" },
                  ],
                },
                selector: ".btn-primary, button",
                label: "Button radius",
                defaultValue: "0.5rem",
                category: { id: "buttons" },
              },
            ],
          },
          identity: {
            id: user.id,
          },
          assets: {
            storageType: "self",
            onUpload: customAssetManager.onUpload,
            onDelete: customAssetManager.onDelete,
            onLoad: customAssetManager.onLoad,
          },
          storage: {
            type: "self",
            autosaveChanges: 100,
            autosaveIntervalMs: 100000,

            onSave: async ({ project }) => {
              saveToServer(project);
            },

            onLoad: async () => {
              const hasWebsiteData =
                websiteData && Object.keys(websiteData?.websiteData).length > 0;
              if (hasWebsiteData) {
                return { project: websiteData.websiteData };
              }
              // Wizard hand-off: a personalized draft (business name/
              // description filled into a template's hero copy) staged in
              // sessionStorage by CreateWebsiteWizard. Takes priority over
              // the raw stock ?template= lookup below — same project shape
              // ({pages:[{name,component}]}), just with real content.
              try {
                const params = new URLSearchParams(window.location.search);
                if (params.get("draft") === "wizard") {
                  const raw = sessionStorage.getItem("pending-website-draft");
                  if (raw) {
                    sessionStorage.removeItem("pending-website-draft");
                    const draft = JSON.parse(raw);
                    if (draft?.pages) {
                      return { project: draft };
                    }
                  }
                }
              } catch {}
              // If no existing data, allow initializing from template via query param
              try {
                const params = new URLSearchParams(window.location.search);
                const templateId = params.get("template");
                if (templateId) {
                  const tplRes = await TemplateService.getTemplate(templateId);
                  if (tplRes.success && tplRes.data) {
                    return { project: { pages: tplRes.data.pages } };
                  }
                }
              } catch {}
              return {
                project: {
                  pages: [
                    {
                      name: websiteData?.websiteTitle,
                      component: "<h1>New project</h1>",
                    },
                  ],
                },
              };
            },
          },
          plugins: [
            cardPlugin,
            heroSectionPlugin,
            testimonialPlugin,
            featureBoxPlugin,
            pricingCardPlugin,
            imageGalleryPlugin,
            statsCardPlugin,
            ctaSectionPlugin,
            teamCardPlugin,
            faqItemPlugin,
            blogCardPlugin,
            alertBannerPlugin,
            headerPlugin,
            footerPlugin,
            sectionSeparatorPlugin,
            videoEmbedPlugin,
            contactFormPlugin,
            contactFormMinimalPlugin,
            contactFormSplitPlugin,
            socialLinksPlugin,
            breadcrumbPlugin,
            documentUploaderPlugin,
            documentUploaderCardPlugin,
            documentUploaderDropzonePlugin,
            tableComponent.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/components/table */
            }),
            listPagesComponent.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/components/listPages */
            }),
            fsLightboxComponent.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/components/fslightbox */
            }),
            lightGalleryComponent.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/components/lightGallery */
            }),
            swiperComponent.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/components/swiper */
            }),
            iconifyComponent.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/components/iconify */
            }),
            accordionComponent.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/components/accordion */
            }),
            flexComponent.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/components/flex */
            }),
            rteProseMirror.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/rte/prosemirror */
            }),
            canvasEmptyState.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/canvas/emptyState */
            }),
            canvasFullSize.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/canvas/full-size */
            }),
            canvasGridMode.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/canvas/grid-mode */
            }),
            youtubeAssetProvider.init({
              /* Plugin options: https://app.grapesjs.com/docs-sdk/plugins/asset-providers/youtube-asset-provider */
            }),
            googleFontsAssetProvider.init({
              apiKey: import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
            }),
            animationComponent.init({
              animations({ items }) {
                return items; // Returns all default animations
              },
              block: {
                category: "Custom",
                label: "Animate",
              },
              blockGroup: {
                category: "Custom",
                label: "Animate Group",
              },
              animationStyle: {
                "animation-duration": "1s",
                "animation-timing-function": "ease-out",
                "animation-fill-mode": "both",
              },
              animationGroupStyle: {
                "--stagger-delay": "0.2s",
              },
            }),
          ],
          templates: {
            onLoad: async () => {
              const res = await TemplateService.getTemplates();
              if (!res.success || !res.data) return [];
              return res.data.map((t) => ({
                id: t.templateId,
                name: t.name,
                data: { pages: t.pages },
              }));
            },
          },
        }}
      />

      {/* Saved-state indicator + version-history trigger — rendered as a
          plain React overlay rather than through the SDK's own declarative
          layout, for the same reliability reasons noted above. */}
      {/* top-14 sits below the SDK's own ~50px toolbar row rather than
          overlapping it — top-2 visually collided with the Desktop/device
          selector, confirmed via a live screenshot before this fix. */}
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 pointer-events-none">
        {saveStatus !== "idle" && (
          <div
            className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shadow-lg border transition-colors ${
              saveStatus === "saving"
                ? "bg-[#1a1a1a] border-white/20 text-gray-300"
                : saveStatus === "saved"
                ? "bg-[#12261a] border-green-700/50 text-green-400"
                : "bg-[#2a1414] border-red-700/50 text-red-400"
            }`}
          >
            {saveStatus === "saving" && (
              <>
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                Saving…
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Saved{lastSavedAt ? ` ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
              </>
            )}
            {saveStatus === "error" && (
              <>
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Save failed
              </>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={openVersionHistory}
          className="pointer-events-auto px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-white/20 bg-[#1a1a1a] text-gray-300 hover:text-white hover:border-white/40 transition-colors"
          title="Version history"
        >
          History
        </button>
      </div>

      {/* Ask Ninja — always-visible floating control for plain-English
          website edits, plus one-click Rewrite Section / Redesign Section /
          Regenerate Image when something's selected in the canvas. Plain
          React overlay for the same reliability reasons as the panel
          above — see extractHtmlForAiEdit's comment for why this operates
          on the current selection rather than a backend "section" concept. */}
      <button
        type="button"
        onClick={() => setAskNinjaOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold shadow-2xl bg-gradient-to-r from-[#DC2626] to-[#EA580C] text-white hover:brightness-110 transition-all"
        title="Ask Ninja to make a change"
      >
        <span className="text-base">✨</span>
        Ask Ninja
      </button>

      {askNinjaOpen && (
        <div className="fixed bottom-24 right-6 z-[10000] w-[320px] max-w-[90vw] rounded-xl bg-[#1a1a1a] border border-[#333] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-[#333]">
            <h3 className="text-white font-semibold text-sm">✨ Ask Ninja</h3>
            <button
              onClick={() => setAskNinjaOpen(false)}
              className="text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
          <div className="p-3 space-y-3">
            <div className="text-[11px] text-gray-500">
              {askNinjaSelection
                ? `Editing selected ${askNinjaSelection.label} element`
                : "Editing the whole page — select something in the canvas to target just one section"}
            </div>
            <textarea
              value={askNinjaInstruction}
              onChange={(e) => setAskNinjaInstruction(e.target.value)}
              placeholder="Tell Ninja what to change…"
              rows={3}
              disabled={askNinjaBusy !== "idle"}
              className="w-full resize-none rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] text-white text-xs p-2.5 placeholder:text-gray-600 focus:outline-none focus:border-[#DC2626]/60 disabled:opacity-50"
            />
            <div className="flex flex-wrap gap-2">
              {askNinjaSelection?.isImage && (
                <button
                  type="button"
                  onClick={handleRegenerateImage}
                  disabled={askNinjaBusy !== "idle"}
                  className="flex-1 px-2.5 py-1.5 text-[11px] rounded-md bg-[#252525] text-gray-200 hover:bg-[#2f2f2f] border border-[#333] disabled:opacity-50"
                >
                  {askNinjaBusy === "image" ? "Generating…" : "🖼 Regenerate Image"}
                </button>
              )}
              {askNinjaSelection && !askNinjaSelection.isImage && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      runAskNinja(
                        "rewrite",
                        askNinjaInstruction.trim() ||
                          "Improve and polish the wording of this section's text — keep the same structure and roughly the same length."
                      )
                    }
                    disabled={askNinjaBusy !== "idle"}
                    className="flex-1 px-2.5 py-1.5 text-[11px] rounded-md bg-[#252525] text-gray-200 hover:bg-[#2f2f2f] border border-[#333] disabled:opacity-50"
                  >
                    {askNinjaBusy === "rewrite" ? "Rewriting…" : "✍ Rewrite Section"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      runAskNinja(
                        "redesign",
                        askNinjaInstruction.trim() ||
                          "Give this section a more modern, polished visual style — refine colors, spacing, and typography while keeping the same content."
                      )
                    }
                    disabled={askNinjaBusy !== "idle"}
                    className="flex-1 px-2.5 py-1.5 text-[11px] rounded-md bg-[#252525] text-gray-200 hover:bg-[#2f2f2f] border border-[#333] disabled:opacity-50"
                  >
                    {askNinjaBusy === "redesign" ? "Redesigning…" : "🎨 Redesign Section"}
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => runAskNinja("ask")}
              disabled={askNinjaBusy !== "idle" || !askNinjaInstruction.trim()}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-[#DC2626] text-white hover:bg-[#DC2626]/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {askNinjaBusy === "ask" ? "Applying…" : "Send to Ninja"}
            </button>
          </div>
        </div>
      )}

      {showVersionHistory && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setShowVersionHistory(false)}
          />
          <div className="relative z-10 w-[90%] max-w-md max-h-[70vh] flex flex-col rounded-xl bg-[#1a1a1a] border border-[#333] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h3 className="text-white font-semibold text-sm">Version History</h3>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loadingVersions ? (
                <div className="text-center py-8 text-gray-500 text-sm">Loading…</div>
              ) : versions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No earlier versions yet — checkpoints are saved automatically as you edit
                  (at most one every 10 minutes) and always right before you publish.
                </div>
              ) : (
                <div className="space-y-2">
                  {versions.map((v) => (
                    <div
                      key={v._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a]"
                    >
                      <div className="text-xs text-gray-300">
                        {new Date(v.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <button
                        onClick={() => handleRestoreVersion(v._id)}
                        disabled={restoringVersionId !== null}
                        className="px-3 py-1.5 text-xs rounded-md bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20 border border-[#DC2626]/30 disabled:opacity-50"
                      >
                        {restoringVersionId === v._id ? "Restoring…" : "Restore"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WebsiteBuilderStudio;
