import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const contactFormMinimalPlugin = (editor: Editor) => {
  editor.Components.addType("contact-form-minimal", {
    isComponent: (el: any) => el.classList?.contains("contact-form-minimal"),
    model: {
      defaults: {
        tagName: "form",
        attributes: { class: "contact-form-minimal", 'data-owner-email': '' },
        styles: `
          .contact-form-minimal { max-width: 520px; margin: 0 auto; padding: 24px; background: #fff; border-radius: 12px; border: 1px solid #eee; }
          .cfm-title { font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 12px; text-align: center; }
          .cfm-desc { color: #6b7280; font-size: .95rem; text-align: center; margin-bottom: 20px; }
          .cfm-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
          .cfm-input, .cfm-textarea { width: 100%; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: .95rem; }
          .cfm-textarea { min-height: 110px; resize: vertical; }
          .cfm-submit { width: 100%; padding: 12px 16px; background: #111827; color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }
        `,
        components: `
          <div class="cfm-title">Contact Us</div>
          <div class="cfm-desc">We typically respond within 1 business day</div>
          <div class="cfm-group">
            <label>Name</label>
            <input type="text" class="cfm-input" placeholder="Your name" required/>
          </div>
          <div class="cfm-group">
            <label>Email</label>
            <input type="email" class="cfm-input" placeholder="your.email@example.com" required/>
          </div>
          <div class="cfm-group">
            <label>Subject</label>
            <input type="text" class="cfm-input" placeholder="Subject" required/>
          </div>
          <div class="cfm-group">
            <label>Message</label>
            <textarea class="cfm-textarea" placeholder="Your message here..." required></textarea>
          </div>
          <button type="submit" class="cfm-submit">Send Message</button>
        `,
        traits: [
          { type: 'text', label: 'Form recipient email', name: 'data-owner-email', placeholder: 'recipient@example.com' },
        ],
        script: function () {
          // @ts-ignore
          const form = this as HTMLFormElement;
          const ownerEmail = form.getAttribute('data-owner-email') || '';
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
              const nameEl = form.querySelector<HTMLInputElement>('.cfm-input[type="text"]');
              const emailEl = form.querySelector<HTMLInputElement>('.cfm-input[type="email"]');
              const subjectEl = form.querySelectorAll<HTMLInputElement>('.cfm-input')[2];
              const messageEl = form.querySelector<HTMLTextAreaElement>('.cfm-textarea');
              const payload = {
                toEmail: ownerEmail,
                name: nameEl?.value || '',
                email: emailEl?.value || '',
                subject: subjectEl?.value || '',
                message: messageEl?.value || '',
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

  editor.Blocks.add("contact-form-minimal", {
    label: "Contact Form (Minimal)",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#e8eaed"><path d="M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm340-302L140-685v465h680v-465L480-462Zm0-60 336-218H144l336 218ZM140-685v-55 520-465Z"/></svg>',
    content: { type: "contact-form-minimal" },
  });
};


