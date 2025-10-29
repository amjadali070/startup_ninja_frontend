import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const contactFormPlugin = (editor: Editor) => {
  editor.Components.addType("contact-form", {
    isComponent: (el: any) => el.classList?.contains("contact-form"),
    model: {
      defaults: {
        tagName: "form",
        attributes: { class: "contact-form", 'data-owner-email': '' },
        styles: `
          .contact-form {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }
          .form-group {
            margin-bottom: 24px;
          }
          .form-label {
            display: block;
            font-size: 0.95rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1a1a1a;
          }
          .form-input,
          .form-textarea {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 1rem;
            transition: border-color 0.3s;
            font-family: inherit;
          }
          .form-input:focus,
          .form-textarea:focus {
            outline: none;
            border-color: #667eea;
          }
          .form-textarea {
            min-height: 120px;
            resize: vertical;
          }
          .form-submit {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .form-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
        `,
        components: `
          <div class="form-group">
            <label class="form-label">Name</label>
            <input type="text" class="form-input" placeholder="Your name" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" placeholder="your.email@example.com" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Subject</label>
            <input type="text" class="form-input" placeholder="Subject" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="form-textarea" placeholder="Your message here..." required></textarea>
          </div>
          <button type="submit" class="form-submit">Send Message</button>
        `,
        traits: [
          {
            type: 'text',
            label: 'Form recipient email',
            name: 'data-owner-email',
            placeholder: 'recipient@example.com',
          },
        ],
        script: function () {
          // @ts-ignore
          const form = this as HTMLFormElement;
          const ownerEmail = form.getAttribute('data-owner-email') || '';
          const status = document.createElement('div');
          status.style.marginTop = '10px';
          form.appendChild(status);

          const setStatus = (msg: string, color = '#374151') => { status.textContent = msg; (status as any).style.color = color; };

          // Resolve API base, avoid mixed content (aligned with DocumentUploader, but tolerant if base misses /api)
          const apiBase = (window as any)?.__API_BASE_URL || '';
          const isMixed = window.location.protocol === 'https:' && apiBase && apiBase.startsWith('http://');
          const ensureApi = (b: string) => !b ? '' : (b.endsWith('/api') ? b : `${b.replace(/\/+$/, '')}/api`);
          const base = ensureApi(apiBase);
          const endpoint = isMixed ? '/api/user/contact-email' : (base ? `${base}/user/contact-email` : '/api/user/contact-email');

          form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            try {
              if (!ownerEmail) { setStatus('Owner email not set. Please configure in properties.', '#b91c1c'); return; }
              const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.form-input, .form-textarea');
              const [nameEl, emailEl, subjectEl, messageEl] = Array.from(inputs);
              const payload = {
                toEmail: ownerEmail,
                name: nameEl?.value || '',
                email: emailEl?.value || '',
                subject: subjectEl?.value || '',
                message: (messageEl as HTMLTextAreaElement)?.value || '',
                // Optional context
                websiteId: (window as any)?.__WEBSITE_ID || ''
              };
              setStatus('Sending...');
              const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (!res.ok) throw new Error('Failed');
              setStatus('Message sent successfully.', '#065f46');
              form.reset();
            } catch (err) {
              setStatus('Failed to send message.', '#b91c1c');
            }
          });
        },
      },
    },
  });
  
  editor.Blocks.add("contact-form", {
    label: "Contact Form",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><path d="M21 8V7l-3 2-3-2v1l3 2 3-2z"/><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2v.511l9 5.4 9-5.4V7H3zm18 10V9.489l-8.553 5.136a1 1 0 0 1-1.894 0L3 9.49V17h18z"/></svg>',
    content: {
      type: "contact-form",
    },
  });
};

