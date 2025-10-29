import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const contactFormSplitPlugin = (editor: Editor) => {
  editor.Components.addType("contact-form-split", {
    isComponent: (el: any) => el.classList?.contains("contact-form-split"),
    model: {
      defaults: {
        tagName: "section",
        attributes: { class: "contact-form-split", 'data-owner-email': '' },
        styles: `
          .contact-form-split { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.1); }
          .cfs-left { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 28px; display: flex; flex-direction: column; justify-content: center; }
          .cfs-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
          .cfs-text { opacity: .9; }
          .cfs-right { background: #fff; padding: 28px; }
          .cfs-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
          .cfs-input, .cfs-textarea { width: 100%; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: .95rem; }
          .cfs-textarea { min-height: 120px; resize: vertical; }
          .cfs-submit { width: 100%; padding: 12px 16px; background: #667eea; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
          @media(max-width: 800px) { .contact-form-split { grid-template-columns: 1fr; } }
        `,
        components: `
          <div class="cfs-left">
            <div class="cfs-title">Get in Touch</div>
            <div class="cfs-text">Let us know how we can help you. Fill the form and our team will reach out soon.</div>
          </div>
          <form class="cfs-right">
            <div class="cfs-group">
              <label>Name</label>
              <input type="text" class="cfs-input" placeholder="Your name" required/>
            </div>
            <div class="cfs-group">
              <label>Email</label>
              <input type="email" class="cfs-input" placeholder="your.email@example.com" required/>
            </div>
            <div class="cfs-group">
              <label>Subject</label>
              <input type="text" class="cfs-input" placeholder="Subject" required/>
            </div>
            <div class="cfs-group">
              <label>Message</label>
              <textarea class="cfs-textarea" placeholder="Your message here..." required></textarea>
            </div>
            <button type="submit" class="cfs-submit">Send Message</button>
          </form>
        `,
        traits: [
          { type: 'text', label: 'Form recipient email', name: 'data-owner-email', placeholder: 'recipient@example.com' },
        ],
        script: function () {
          // @ts-ignore
          const section = this as HTMLElement;
          const form = section.querySelector('form') as HTMLFormElement;
          const ownerEmail = section.getAttribute('data-owner-email') || '';
          const status = document.createElement('div');
          status.style.marginTop = '10px';
          form.appendChild(status);
          const setStatus = (msg: string, color = '#374151') => { status.textContent = msg; (status as any).style.color = color; };
          const apiBase = (window as any)?.__API_BASE_URL || '';
          const isMixed = window.location.protocol === 'https:' && apiBase && apiBase.startsWith('http://');
          const ensureApi = (b: string) => !b ? '' : (b.endsWith('/api') ? b : `${b.replace(/\/+$/, '')}/api`);
          const base = ensureApi(apiBase);
          const endpoint = isMixed ? '/api/user/contact-email' : (base ? `${base}/user/contact-email` : '/api/user/contact-email');
          form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            try {
              if (!ownerEmail) { setStatus('Owner email not set. Please configure in properties.', '#b91c1c'); return; }
              const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.cfs-input, .cfs-textarea');
              const [nameEl, emailEl, subjectEl, messageEl] = Array.from(inputs);
              const payload = {
                toEmail: ownerEmail,
                name: (nameEl as HTMLInputElement)?.value || '',
                email: (emailEl as HTMLInputElement)?.value || '',
                subject: (subjectEl as HTMLInputElement)?.value || '',
                message: (messageEl as HTMLTextAreaElement)?.value || '',
                websiteId: (window as any)?.__WEBSITE_ID || ''
              };
              setStatus('Sending...');
              const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              if (!res.ok) throw new Error('Failed');
              setStatus('Message sent successfully.', '#065f46');
              form.reset();
            } catch (err) { setStatus('Failed to send message.', '#b91c1c'); }
          });
        },
      },
    },
  });

  editor.Blocks.add("contact-form-split", {
    label: "Contact Form (Split)",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#e8eaed"><path d="M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm340-302L140-685v465h680v-465L480-462Zm0-60 336-218H144l336 218ZM140-685v-55 520-465Z"/></svg>',
    content: { type: "contact-form-split" },
  });
};


