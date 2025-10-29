import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const documentUploaderDropzonePlugin = (editor: Editor) => {
  editor.Components.addType("document-uploader-dropzone", {
    isComponent: (el: any) => el.classList?.contains("document-uploader-dropzone"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "document-uploader-dropzone" },
        styles: `
          .document-uploader-dropzone { background:#0b1220; border:2px dashed #334155; border-radius:16px; padding:28px; color:#cbd5e1; text-align:center; }
          .dud-title { font-weight:800; font-size:1.2rem; margin-bottom:6px; }
          .dud-desc { color:#94a3b8; margin-bottom:14px; }
          .dud-zone { border:2px dashed rgba(255,255,255,.15); border-radius:14px; padding:26px; background:rgba(255,255,255,.03); transition:border-color .2s, background .2s; }
          .dud-zone.drag { border-color:#22c55e; background:rgba(34,197,94,.08); }
          .dud-actions { margin-top:12px; display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; }
          .dud-input { display:none; }
          .dud-button { background:#22c55e; color:#0b1220; border:none; border-radius:10px; padding:10px 16px; font-weight:800; cursor:pointer; }
          .dud-status { margin-top:10px; font-size:.9rem; }
          .dud-progress { height:8px; width:100%; max-width:420px; background:#1f2937; border-radius:8px; overflow:hidden; margin:10px auto 0; }
          .dud-progress-bar { height:8px; width:0%; background:#22c55e; transition:width .2s; }
        `,
        traits: [],
        components: `
          <div class="dud-title">Drag & Drop to Upload</div>
          <div class="dud-desc">PDF/DOC/TXT/Images (10MB) & Videos (50MB). Up to 3 files.</div>
          <div class="dud-zone">
            <div>Drop files here or</div>
            <div class="dud-actions">
              <input class="dud-input" type="file" multiple />
              <button class="dud-button">Browse</button>
            </div>
          </div>
          <div class="dud-status"></div>
          <div class="dud-progress"><div class="dud-progress-bar"></div></div>
        `,
        script: function () {
          // @ts-ignore
          const root = this;
          const zone = root.querySelector('.dud-zone') as HTMLElement | null;
          const input: HTMLInputElement | null = root.querySelector('.dud-input');
          const button: HTMLButtonElement | null = root.querySelector('.dud-button');
          const statusEl: HTMLElement | null = root.querySelector('.dud-status');
          const bar: HTMLElement | null = root.querySelector('.dud-progress-bar');
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
          const handleFiles = (files: File[]) => {
            if (!files.length) return; if (files.length > 3) { setStatus('You can upload max 3 files at once.','#ef9a9a'); return; }
            const websiteId = autoWebsiteId(); const siteToken = (window as any)?.__WEBSITE_TOKEN; const jwt = (window as any)?.__AUTH_JWT;
            const valid = files.every(isAllowed); if (!valid) { setStatus('Some files are disallowed or too large.','#ef9a9a'); return; }
            if (files.length === 1) {
              const file = files[0]; setStatus('Uploading...'); setProgress(10);
              (async () => { try { const fd = new FormData(); fd.append('file', file); if (!siteToken && websiteId) fd.append('websiteId', websiteId);
                await new Promise<void>((resolve, reject) => { const xhr = new XMLHttpRequest(); xhr.open('POST', singleEndpoint, true);
                  if (siteToken) xhr.setRequestHeader('X-Website-Token', siteToken); else if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                  xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(e.loaded / e.total * 100); };
                  xhr.onreadystatechange = () => { if (xhr.readyState === 4) { if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error('Upload failed')); } };
                  xhr.onerror = () => reject(new Error('Network error')); xhr.send(fd);
                }); setProgress(100); setStatus('Uploaded successfully.','#86efac');
              } catch(e) { setProgress(0); setStatus('Upload failed. Please try again.','#ef9a9a'); }})();
              return;
            }
            // multi
            setStatus('Uploading...'); setProgress(10);
            (async () => { try { const fd = new FormData(); files.forEach(f => fd.append('files', f)); if (!siteToken && websiteId) fd.append('websiteId', websiteId);
              await new Promise<void>((resolve, reject) => { const xhr = new XMLHttpRequest(); xhr.open('POST', multiEndpoint, true);
                if (siteToken) xhr.setRequestHeader('X-Website-Token', siteToken); else if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(e.loaded / e.total * 100); };
                xhr.onreadystatechange = () => { if (xhr.readyState === 4) { if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error('Upload failed')); } };
                xhr.onerror = () => reject(new Error('Network error')); xhr.send(fd);
              }); setProgress(100); setStatus('Uploaded successfully.','#86efac');
            } catch (e) { setProgress(0); setStatus('Upload failed. Please try again.','#ef9a9a'); }})();
          };
          if (button) button.addEventListener('click', () => input?.click());
          if (input) input.addEventListener('change', () => handleFiles(input.files ? Array.from(input.files) : []));
          if (zone) {
            zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag'); });
            zone.addEventListener('dragleave', () => { zone.classList.remove('drag'); });
            zone.addEventListener('drop', (e: any) => { e.preventDefault(); zone.classList.remove('drag'); const dt = e.dataTransfer; const files = dt?.files ? Array.from(dt.files) : []; handleFiles(files as any); });
          }
        },
      },
    },
  });

  editor.Blocks.add("document-uploader-dropzone", {
    label: "Document Uploader (Dropzone)",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><path d="M7 18a4 4 0 1 1 0-8 5.5 5.5 0 0 1 10.4-2.1A4.5 4.5 0 1 1 19 18H7z"/><path d="M12 13v5m0-5l-2 2m2-2l2 2" stroke="#0b1220" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    content: { type: "document-uploader-dropzone" },
  });
};


