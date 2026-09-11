import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const newsletterSignupPlugin = (editor: Editor) => {
  editor.Components.addType("newsletter-signup", {
    isComponent: (el: any) => el.classList?.contains("newsletter-signup"),
    model: {
      defaults: {
        tagName: "section",
        attributes: { class: "newsletter-signup" },
        styles: `
          .newsletter-signup {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fff;
            padding: 60px 32px;
            border-radius: 20px;
            text-align: center;
          }
          .newsletter-signup-headline {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 12px;
          }
          .newsletter-signup-subtext {
            font-size: 1.05rem;
            opacity: 0.85;
            max-width: 500px;
            margin: 0 auto 28px auto;
            line-height: 1.6;
          }
          .newsletter-signup-form {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            max-width: 480px;
            margin: 0 auto;
          }
          .newsletter-signup-input {
            flex: 1;
            min-width: 220px;
            padding: 14px 20px;
            font-size: 1rem;
            border: none;
            border-radius: 50px;
            outline: none;
          }
          .newsletter-signup-button {
            padding: 14px 32px;
            font-size: 1rem;
            font-weight: 700;
            color: #fff;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50px;
            cursor: pointer;
            white-space: nowrap;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .newsletter-signup-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
        `,
        traits: [
          {
            type: "text",
            name: "headline",
            label: "Headline",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "subtext",
            label: "Subtext",
            changeProp: true,
          },
          {
            type: "text",
            name: "placeholder",
            label: "Input Placeholder",
            changeProp: true,
          },
          {
            type: "text",
            name: "buttonText",
            label: "Button Text",
            changeProp: true,
          },
        ],
        headline: "Stay in the loop",
        subtext: "Get product updates and news straight to your inbox.",
        placeholder: "Enter your email",
        buttonText: "Subscribe",
        components: `
          <h2 class="newsletter-signup-headline">Stay in the loop</h2>
          <p class="newsletter-signup-subtext">Get product updates and news straight to your inbox.</p>
          <div class="newsletter-signup-form">
            <input type="email" class="newsletter-signup-input" placeholder="Enter your email"/>
            <button type="button" class="newsletter-signup-button">Subscribe</button>
          </div>
        `,
      },
      init() {
        this.on("change:headline change:subtext change:placeholder change:buttonText", this.updateContent);
        if (!this.components().length) {
          this.updateContent();
        }
      },
      updateContent() {
        const headline = this.get("headline");
        const subtext = this.get("subtext");
        const placeholder = this.get("placeholder");
        const buttonText = this.get("buttonText");

        this.components(`
          <h2 class="newsletter-signup-headline">${headline}</h2>
          <p class="newsletter-signup-subtext">${subtext}</p>
          <div class="newsletter-signup-form">
            <input type="email" class="newsletter-signup-input" placeholder="${placeholder}"/>
            <button type="button" class="newsletter-signup-button">${buttonText}</button>
          </div>
        `);
      },
    },
  });

  editor.Blocks.add("newsletter-signup", {
    label: "Newsletter Signup",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#e8eaed" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    content: {
      type: "newsletter-signup",
    },
  });
};
