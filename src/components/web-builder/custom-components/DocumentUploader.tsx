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
          <div class="du-title">Upload your document</div>
          <div class="du-desc">Accepted: PDF, DOC, DOCX, PPT, TXT (max 10MB)</div>
          <div class="du-actions">
            <input class="du-input" type="file" />
            <button class="du-button">Upload Document</button>
          </div>
          <div class="du-status"></div>
          <div class="du-progress"><div class="du-progress-bar"></div></div>
        `,
        script: function () {
          // @ts-ignore GrapesJS mounts the DOM element as `this`
          const root = this;
          const input: HTMLInputElement | null = root.querySelector('.du-input');
          const button: HTMLButtonElement | null = root.querySelector('.du-button');
          const statusEl: HTMLElement | null = root.querySelector('.du-status');
          const bar: HTMLElement | null = root.querySelector('.du-progress-bar');

          const getAttr = (n: string, d = '') => root.getAttribute(n) || d;
          const setStatus = (msg: string, color = '#374151') => { if (statusEl) { statusEl.textContent = msg; statusEl.style.color = color; } };
          const setProgress = (pct: number) => { if (bar) bar.style.width = Math.max(0, Math.min(100, pct)) + '%'; };

          // Auto-detect website id: try meta tag or global injected variable
          const autoWebsiteId = () => {
            const meta = document.querySelector('meta[name="x-website-id"]') as HTMLMetaElement | null;
            // @ts-ignore
            return getAttr('data-website-id') || meta?.content || (window as any)?.__WEBSITE_ID || '';
          };

          // Sensible defaults (non-technical users)
          const accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt';
          const maxSizeMb = 10;
          const apiBase = (window as any)?.__API_BASE_URL || '';
          const isMixed = window.location.protocol === 'https:' && apiBase && apiBase.startsWith('http://');
          const endpoint = (window as any)?.__WB_UPLOAD_ENDPOINT || (isMixed ? '/api/website-builder/uploads/document' : (apiBase ? `${apiBase}/website-builder/uploads/document` : '/api/website-builder/uploads/document'));
          const buttonText = 'Upload Document';
          const successMsg = 'Uploaded successfully.';
          const errorMsg = 'Upload failed. Please try again.';

          if (input) input.setAttribute('accept', accept);
          if (button) button.textContent = buttonText;

          const openPicker = () => input?.click();

          const upload = async (file: File) => {
            const websiteId = autoWebsiteId();
            // For published sites, token will scope website; websiteId optional
            if (file.size > maxSizeMb * 1024 * 1024) {
              setStatus(`File too large. Max ${maxSizeMb}MB.`, '#b91c1c');
              return;
            }
            setStatus('Uploading...');
            setProgress(10);
            try {
              const fd = new FormData();
              fd.append('file', file);
              // Only attach websiteId when no website token is present
              // @ts-ignore
              if (!(window as any)?.__WEBSITE_TOKEN && websiteId) {
                fd.append('websiteId', websiteId);
              }

              // Use fetch with progress via XHR fallback
              await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', endpoint, true);
                // Add auth headers if available
                // @ts-ignore
                const siteToken = (window as any)?.__WEBSITE_TOKEN;
                // @ts-ignore
                const jwt = (window as any)?.__AUTH_JWT;
                if (siteToken) xhr.setRequestHeader('X-Website-Token', siteToken);
                else if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                xhr.upload.onprogress = (e) => {
                  if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
                };
                xhr.onreadystatechange = () => {
                  if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error('Upload failed'));
                  }
                };
                xhr.onerror = () => reject(new Error('Network error'));
                xhr.send(fd);
              });

              setProgress(100);
              setStatus(successMsg, '#065f46');
            } catch (err) {
              setProgress(0);
              setStatus(errorMsg, '#b91c1c');
            }
          };

          button?.addEventListener('click', () => openPicker());
          input?.addEventListener('change', () => {
            const f = input.files && input.files[0];
            if (f) upload(f);
          });
        },
      },
    },
  });

  editor.Blocks.add("document-uploader", {
    label: "Document Uploader",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#e8eaed"><path d="M520-640v-200l200 200H520Zm-320 560q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h280v240h240v480q0 33-23.5 56.5T640-80H200Zm240-200h160v-80H440v-160H360v160h-160v80h160v160h80v-160Z"/></svg>',
    content: { type: "document-uploader" },
  });
};


