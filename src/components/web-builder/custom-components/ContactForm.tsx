import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const contactFormPlugin = (editor: Editor) => {
  editor.Components.addType("contact-form", {
    isComponent: (el: any) => el.classList?.contains("contact-form"),
    model: {
      defaults: {
        tagName: "form",
        attributes: { class: "contact-form" },
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
      },
    },
  });
  
  editor.Blocks.add("contact-form", {
    label: "Contact Form",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm340-302L140-685v465h680v-465L480-462Zm0-60 336-218H144l336 218ZM140-685v-55 520-465Z"/></svg>',
    content: {
      type: "contact-form",
    },
  });
};

