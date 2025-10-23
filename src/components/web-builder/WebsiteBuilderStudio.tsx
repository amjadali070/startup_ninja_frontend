import { useEffect, useRef, useState, type FC } from "react";
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
} from "@grapesjs/studio-sdk-plugins";
import "@grapesjs/studio-sdk/style";
import { useLocation, useNavigate } from "react-router-dom";
import WebBuilderService, {
  WebsiteProject,
} from "../../services/web-builder/WebBuilderService";
import GalleryService from "../../services/web-builder/GalleryService";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";
import DemoTemplates from "./config/DemoTemplates";
import LoadingSpinner from "../LoadingSpinner";

const WebsiteBuilderStudio: FC = () => {
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [websiteData, setWebsiteData] = useState<WebsiteProject | null>(null);
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const websiteId = params.get("id");

    // Validate ID
    if (!websiteId) {
      navigate("/ai-tools/web-builder", { replace: true });
      return;
    }

    // Fetch website data
    const fetchWebsiteData = async () => {
      try {
        if (!user.id) {
          navigate("/ai-tools/web-builder", { replace: true });
          return;
        }

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
  }, [location.search, navigate]);

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

  const cardPlugin = (editor: Editor) => {
    // Register card component
    editor.Components.addType("card", {
      isComponent: (el: any) => el.classList?.contains("card"),
      model: {
        defaults: {
          tagName: "div",
          attributes: { class: "card" },
          traits: [
            {
              type: "text",
              name: "title",
              label: "Card Title",
              changeProp: true,
            },
            {
              type: "text",
              name: "imageUrl",
              label: "Image URL",
              changeProp: true,
            },
            {
              type: "textarea",
              name: "content",
              label: "Card Content",
              changeProp: true,
            },
          ],
          title: "Card Title",
          imageUrl: "https://picsum.photos/seed/my-image/300/200",
          content: "Add your content here",
          components: `
                    <div class="card-image">
                        <img src="https://picsum.photos/seed/my-image/300/200" alt="Card Title"/>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Card Title</h3>
                        <p class="card-text">Add your content here</p>
                    </div>
                `,
        },
        init() {
          this.on(
            "change:title change:imageUrl change:content",
            this.updateContent
          );
        },
        updateContent() {
          const title = this.get("title");
          const imageUrl = this.get("imageUrl");
          const content = this.get("content");

          this.components(`
                    <div class="card-image">
                        <img src="${imageUrl}" alt="${title}"/>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${title}</h3>
                        <p class="card-text">${content}</p>
                    </div>
                `);
        },
      },
    });
    editor.Blocks.add("card", {
      label: "Card",
      category: "Custom",
      media:
        '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M560-440h200v-80H560v80Zm0-120h200v-80H560v80ZM200-320h320v-22q0-45-44-71.5T360-440q-72 0-116 26.5T200-342v22Zm160-160q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>',
      content: {
        type: "card",
      },
    });
  };

  const saveToServer = async (project: any) => {
    try {
      const iframe = document.querySelector(".gjs-frame") as HTMLIFrameElement;
      if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
        toast.error("There is an issue when saving website");
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
        console.log("Success");
        toast.success("Website saved successfully!");
      } else {
        console.log("Failed");
        toast.error(response.message);
      }
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save website!");
    }
  };

  const navigatetoHome = (editor: any) => {
    console.log("Editor : ", editor);
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
    const firstPage = files.find((file) => file.mimeType === "text/html");
    const websiteHtml = firstPage ? firstPage.content : "";

    const deviceSizes: Record<
      string,
      {
        width: string;
        maxWidth: string;
      }
    > = {
      desktop: { width: "100%", maxWidth: "1200px" },
      tablet: { width: "768px", maxWidth: "992px" },
      mobile: { width: "568px", maxWidth: "768px" },
    };

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
                    id: "preview-iframe-container",
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

      const firstPage = files.find((file) => file.mimeType === "text/html");
      const websiteHtml = firstPage ? firstPage.content : "";

      if (!websiteHtml) {
        toast.error("No website content found to publish", {
          id: "publish-loading",
        });
        return;
      }

      const response = await WebBuilderService.publishWebsite(
        user.id,
        websiteData._id,
        websiteHtml
      );

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
          toast.success(
            `${successfulUploads.length} asset(s) uploaded successfully`,
            { id: "upload-assets" }
          );
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
          .map((asset) => asset.getSrc().split("/").pop()?.split("_")[0])
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
          setTimeout(() => addDeviceIcons(), 200);

          editor.on("device:select", () => {
            setTimeout(() => addDeviceIcons(), 100);
          });

          const observer = new MutationObserver(() => {
            addDeviceIcons();
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }}
        options={{
          devices: {
            default: [
              {
                id: "desktop",
                name: "Desktop",
                width: "1200px",
                widthMedia: "1800px",
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
            "7560c2162e0840c48d8436e090b0d1c275fbab9659b54ebc83f4123cc00162da",
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
                        padding: 5,
                        gap: 10,
                        borderRightWidth: "1px",
                        backgroundColor: "#1a1a1a",
                        minWidth: "60px",
                        alignItems: "center",
                        marginTop: 10,
                        marginBottom: 10,
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
                        // Assets Button - Replace your existing assets button with this:
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
                                      const attributes: Record<string, string> =
                                        {};
                                      for (const attr of importButton.attributes) {
                                        attributes[attr.name] = attr.value;
                                      }
                                      console.log(
                                        "Import button attributes:",
                                        attributes
                                      );
                                      importButton.click();
                                    } else {
                                      console.error(
                                        "Import code button not found"
                                      );
                                    }
                                  },
                                },
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
              return {
                project: hasWebsiteData
                  ? websiteData.websiteData
                  : {
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
          ],
          templates: {
            onLoad: async () => [...DemoTemplates],
          },
        }}
      />
    </div>
  );
};
export default WebsiteBuilderStudio;
