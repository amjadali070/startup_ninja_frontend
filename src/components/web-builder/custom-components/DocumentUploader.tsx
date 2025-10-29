import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const documentUploaderPlugin = (editor: Editor) => {
  editor.Components.addType("document-uploader", {
    isComponent: (el: any) => el.classList?.contains("document-uploader"),
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          class: "document-uploader",
        },
        styles: `
          .document-uploader { background: #fff; border: 2px dashed #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; }
          .du-title { font-weight: 700; margin-bottom: 8px; color: #1f2937; }
          .du-desc { font-size: 0.95rem; color: #6b7280; margin-bottom: 14px; }
          .du-actions { display: flex; gap: 10px; justify-content: center; align-items: center; flex-wrap: wrap; }
          .du-input { display: none; }
          .du-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; border-radius: 10px; padding: 10px 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(102,126,234,0.3); }
          .du-status { margin-top: 10px; font-size: 0.9rem; color: #374151; }
          .du-progress { height: 8px; width: 100%; max-width: 360px; background: #f3f4f6; border-radius: 8px; overflow: hidden; margin: 10px auto 0; }
          .du-progress-bar { height: 8px; width: 0%; background: #667eea; transition: width 0.2s; }
        `,
        traits: [],
        components: `
          <div class="du-title">Upload your files</div>
          <div class="du-desc">Add Files (10MB Docs/Imgs, 50MB Videos)</div>
          <div class="du-actions">
            <input class="du-input" type="file" multiple />
            <button class="du-button">Upload Files</button>
          </div>
          <div class="du-status"></div>
          <div class="du-progress"><div class="du-progress-bar"></div></div>
        `,
        script: function () {
          // @ts-ignore GrapesJS mounts the DOM element as `this`
          const root = this;
          const input: HTMLInputElement | null =
            root.querySelector(".du-input");
          const button: HTMLButtonElement | null =
            root.querySelector(".du-button");
          const statusEl: HTMLElement | null = root.querySelector(".du-status");
          const bar: HTMLElement | null =
            root.querySelector(".du-progress-bar");

          const getAttr = (n: string, d = "") => root.getAttribute(n) || d;
          const setStatus = (msg: string, color = "#374151") => {
            if (statusEl) {
              statusEl.textContent = msg;
              statusEl.style.color = color;
            }
          };
          const setProgress = (pct: number) => {
            if (bar) bar.style.width = Math.max(0, Math.min(100, pct)) + "%";
          };

          // Auto-detect website id: try meta tag or global injected variable
          const autoWebsiteId = () => {
            const meta = document.querySelector(
              'meta[name="x-website-id"]'
            ) as HTMLMetaElement | null;
            // @ts-ignore
            return (
              getAttr("data-website-id") ||
              meta?.content ||
              (window as any)?.__WEBSITE_ID ||
              ""
            );
          };

          // Sensible defaults (non-technical users)
          const accept =
            ".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.webm,.ogg";
          const maxDocsMb = 10; // docs & images
          const maxVideoMb = 50; // videos
          const apiBase = (window as any)?.__API_BASE_URL || "";
          const isMixed =
            window.location.protocol === "https:" &&
            apiBase &&
            apiBase.startsWith("http://");
          const ensureApi = (b: string) => !b ? '' : (b.endsWith('/api') ? b : `${b.replace(/\/+$/, '')}/api`);
          const base = ensureApi(apiBase);
          const endpoint =
            (window as any)?.__WB_UPLOAD_ENDPOINT ||
            (isMixed
              ? "/api/website-builder/uploads/document"
              : base
              ? `${base}/website-builder/uploads/document`
              : "/api/website-builder/uploads/document");
          const buttonText = "Upload Document";
          const successMsg = "Uploaded successfully.";
          const errorMsg = "Upload failed. Please try again.";

          if (input) input.setAttribute("accept", accept);
          if (button) button.textContent = buttonText;

          const openPicker = () => input?.click();

          const isAllowed = (file: File) => {
            const type = file.type || "";
            const isVideo = type.startsWith("video/");
            const isImage = type.startsWith("image/");
            const allowedDocs = [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-powerpoint",
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              "text/plain",
            ];
            if (!(isVideo || isImage) && !allowedDocs.includes(type))
              return false;
            const maxMb = isVideo ? maxVideoMb : maxDocsMb;
            return file.size <= maxMb * 1024 * 1024;
          };

          const upload = async (file: File) => {
            const websiteId = autoWebsiteId();
            // For published sites, token will scope website; websiteId optional
            if (!isAllowed(file)) {
              setStatus("Disallowed file or too large.", "#b91c1c");
              return;
            }
            setStatus("Uploading...");
            setProgress(10);
            try {
              const fd = new FormData();
              fd.append("file", file);
              // Only attach websiteId when no website token is present
              // @ts-ignore
              if (!(window as any)?.__WEBSITE_TOKEN && websiteId) {
                fd.append("websiteId", websiteId);
              }

              // Use fetch with progress via XHR fallback
              await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", endpoint, true);
                // Add auth headers if available
                // @ts-ignore
                const siteToken = (window as any)?.__WEBSITE_TOKEN;
                // @ts-ignore
                const jwt = (window as any)?.__AUTH_JWT;
                if (siteToken)
                  xhr.setRequestHeader("X-Website-Token", siteToken);
                else if (jwt)
                  xhr.setRequestHeader("Authorization", `Bearer ${jwt}`);
                xhr.upload.onprogress = (e) => {
                  if (e.lengthComputable)
                    setProgress((e.loaded / e.total) * 100);
                };
                xhr.onreadystatechange = () => {
                  if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) resolve();
                    else reject(new Error("Upload failed"));
                  }
                };
                xhr.onerror = () => reject(new Error("Network error"));
                xhr.send(fd);
              });

              setProgress(100);
              setStatus(successMsg, "#065f46");
            } catch (err) {
              setProgress(0);
              setStatus(errorMsg, "#b91c1c");
            }
          };

          button?.addEventListener("click", () => openPicker());
          input?.addEventListener("change", () => {
            const files = input.files ? Array.from(input.files) : [];
            if (!files.length) return;
            if (files.length > 3) {
              setStatus("You can upload max 3 files at once.", "#b91c1c");
              return;
            }
            const websiteId = autoWebsiteId();
            const siteToken = (window as any)?.__WEBSITE_TOKEN;
            const jwt = (window as any)?.__AUTH_JWT;
            if (files.length === 1) {
              upload(files[0]);
              return;
            }
            // Multiple upload path
            if (!files.every(isAllowed)) {
              setStatus("Some files are disallowed or too large.", "#b91c1c");
              return;
            }
            const multiEndpoint = isMixed
              ? "/api/website-builder/uploads/documents"
              : base
              ? `${base}/website-builder/uploads/documents`
              : "/api/website-builder/uploads/documents";
            setStatus("Uploading...");
            setProgress(10);
            (async () => {
              try {
                const fd = new FormData();
                files.forEach((f) => fd.append("files", f));
                if (!siteToken && websiteId) fd.append("websiteId", websiteId);
                await new Promise<void>((resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.open("POST", multiEndpoint, true);
                  if (siteToken)
                    xhr.setRequestHeader("X-Website-Token", siteToken);
                  else if (jwt)
                    xhr.setRequestHeader("Authorization", `Bearer ${jwt}`);
                  xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable)
                      setProgress((e.loaded / e.total) * 100);
                  };
                  xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                      if (xhr.status >= 200 && xhr.status < 300) resolve();
                      else reject(new Error("Upload failed"));
                    }
                  };
                  xhr.onerror = () => reject(new Error("Network error"));
                  xhr.send(fd);
                });
                setProgress(100);
                setStatus(successMsg, "#065f46");
              } catch (e) {
                setProgress(0);
                setStatus(errorMsg, "#b91c1c");
              }
            })();
          });
        },
      },
    },
  });

  editor.Blocks.add("document-uploader", {
    label: "Document Uploader",
    category: "Custom",
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/><path d="M12 18v-5m0 0l-2 2m2-2l2 2" stroke="#e8eaed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    content: { type: "document-uploader" },
  });
};
