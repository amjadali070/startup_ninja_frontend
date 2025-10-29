import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const documentUploaderCardPlugin = (editor: Editor) => {
  editor.Components.addType("document-uploader-card", {
    isComponent: (el: any) => el.classList?.contains("document-uploader-card"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "document-uploader-card" },
        styles: `
          .document-uploader-card { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 24px; color: #e5e7eb; box-shadow: 0 10px 25px rgba(0,0,0,.25);}
          .duc-header { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
          .duc-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; }
          .duc-title { font-size: 1.1rem; font-weight: 800; }
          .duc-desc { color:#94a3b8; font-size:.9rem; margin-bottom:12px; }
          .duc-actions { display:flex; gap:10px; align-items:center; }
          .duc-input { display:none; }
          .duc-button { background:#ef4444; color:#fff; border:none; border-radius:10px; padding:10px 14px; font-weight:700; cursor:pointer; }
          .duc-status { margin-top:10px; font-size:.9rem; color:#cbd5e1; }
          .duc-progress { height:8px; width:100%; background:rgba(255,255,255,.08); border-radius:8px; overflow:hidden; margin-top:8px; }
          .duc-progress-bar { height:8px; width:0%; background:#ef4444; transition:width .2s ease; }
        `,
        traits: [],
        components: `
          <div class="duc-header">
            <div class="duc-icon">📄</div>
            <div class="duc-title">Smart Uploader</div>
          </div>
          <div class="duc-desc">Upload docs, images (10MB) or videos (50MB). Max 3 files.</div>
          <div class="duc-actions">
            <input class="duc-input" type="file" multiple />
            <button class="duc-button">Choose Files</button>
          </div>
          <div class="duc-status"></div>
          <div class="duc-progress"><div class="duc-progress-bar"></div></div>
        `,
        script: function () {
          // @ts-ignore
          const root = this;
          const input: HTMLInputElement | null = root.querySelector('.duc-input');
          const button: HTMLButtonElement | null = root.querySelector('.duc-button');
          const statusEl: HTMLElement | null = root.querySelector('.duc-status');
          const bar: HTMLElement | null = root.querySelector('.duc-progress-bar');
          const setStatus = (msg: string, color = '#cbd5e1') => { if (statusEl) { statusEl.textContent = msg; (statusEl as any).style.color = color; } };
          const setProgress = (pct: number) => { if (bar) bar.style.width = Math.max(0, Math.min(100, pct)) + '%'; };
          const apiBase = (window as any)?.__API_BASE_URL || '';
          const isMixed = window.location.protocol === 'https:' && apiBase && apiBase.startsWith('http://');
          const ensureApi = (b: string) => !b ? '' : (b.endsWith('/api') ? b : `${b.replace(/\/+$/, '')}/api`);
          const base = ensureApi(apiBase);
          const singleEndpoint = isMixed ? '/api/website-builder/uploads/document' : (base ? `${base}/website-builder/uploads/document` : '/api/website-builder/uploads/document');
          const multiEndpoint = isMixed ? '/api/website-builder/uploads/documents' : (base ? `${base}/website-builder/uploads/documents` : '/api/website-builder/uploads/documents');
          const autoWebsiteId = () => {
            const meta = document.querySelector('meta[name="x-website-id"]') as HTMLMetaElement | null;
            return (root.getAttribute('data-website-id') || meta?.content || (window as any)?.__WEBSITE_ID || '') as string;
          };
          const isAllowed = (file: File) => {
            const t = file.type || ''; const isV = t.startsWith('video/'); const isI = t.startsWith('image/');
            const docs = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','text/plain'];
            if (!(isV || isI) && !docs.includes(t)) return false; const maxMb = isV ? 50 : 10; return file.size <= maxMb * 1024 * 1024;
          };
          const openPicker = () => input?.click();
          const uploadSingle = async (file: File) => {
            const websiteId = autoWebsiteId(); if (!isAllowed(file)) { setStatus('Disallowed file or too large.','#ef9a9a'); return; }
            setStatus('Uploading...'); setProgress(10);
            try { const fd = new FormData(); fd.append('file', file); if (!(window as any)?.__WEBSITE_TOKEN && websiteId) fd.append('websiteId', websiteId);
              await new Promise<void>((resolve, reject) => { const xhr = new XMLHttpRequest(); xhr.open('POST', singleEndpoint, true);
                const siteToken = (window as any)?.__WEBSITE_TOKEN; const jwt = (window as any)?.__AUTH_JWT;
                if (siteToken) xhr.setRequestHeader('X-Website-Token', siteToken); else if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(e.loaded / e.total * 100); };
                xhr.onreadystatechange = () => { if (xhr.readyState === 4) { if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error('Upload failed')); } };
                xhr.onerror = () => reject(new Error('Network error')); xhr.send(fd);
              }); setProgress(100); setStatus('Uploaded successfully.','#86efac');
            } catch(e) { setProgress(0); setStatus('Upload failed. Please try again.','#ef9a9a'); }
          };
          button?.addEventListener('click', () => openPicker());
          input?.addEventListener('change', () => {
            const files = input.files ? Array.from(input.files) : []; if (!files.length) return; if (files.length > 3) { setStatus('You can upload max 3 files at once.','#ef9a9a'); return; }
            const websiteId = autoWebsiteId(); const siteToken = (window as any)?.__WEBSITE_TOKEN; const jwt = (window as any)?.__AUTH_JWT;
            if (files.length === 1) { uploadSingle(files[0]); return; }
            if (!files.every(isAllowed)) { setStatus('Some files are disallowed or too large.','#ef9a9a'); return; }
            setStatus('Uploading...'); setProgress(10);
            (async () => { try { const fd = new FormData(); files.forEach(f => fd.append('files', f)); if (!siteToken && websiteId) fd.append('websiteId', websiteId);
              await new Promise<void>((resolve, reject) => { const xhr = new XMLHttpRequest(); xhr.open('POST', multiEndpoint, true);
                if (siteToken) xhr.setRequestHeader('X-Website-Token', siteToken); else if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(e.loaded / e.total * 100); };
                xhr.onreadystatechange = () => { if (xhr.readyState === 4) { if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error('Upload failed')); } };
                xhr.onerror = () => reject(new Error('Network error')); xhr.send(fd);
              }); setProgress(100); setStatus('Uploaded successfully.','#86efac');
            } catch (e) { setProgress(0); setStatus('Upload failed. Please try again.','#ef9a9a'); }})();
          });
        },
      },
    },
  });

  editor.Blocks.add("document-uploader-card", {
    label: "Document Uploader (Card)",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><rect x="3" y="4" width="18" height="14" rx="3" ry="3" fill="none" stroke="#e8eaed" stroke-width="1.5"/><path d="M12 16v-5m0 0l-2 2m2-2l2 2" stroke="#e8eaed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    content: { type: "document-uploader-card" },
  });
};


