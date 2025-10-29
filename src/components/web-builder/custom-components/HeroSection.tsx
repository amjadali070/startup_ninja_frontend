import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const heroSectionPlugin = (editor: Editor) => {
  editor.Components.addType("hero-section", {
    isComponent: (el: any) => el.classList?.contains("hero-section"),
    model: {
      defaults: {
        tagName: "section",
        attributes: { class: "hero-section" },
        styles: `
          .hero-section {
            position: relative;
            min-height: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-size: cover;
            background-position: center;
            color: #fff;
          }
          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%);
          }
          .hero-content {
            position: relative;
            z-index: 1;
            max-width: 800px;
            text-align: center;
            padding: 40px 20px;
          }
          .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.2;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }
          .hero-subtitle {
            font-size: 1.25rem;
            margin-bottom: 30px;
            line-height: 1.6;
            opacity: 0.95;
          }
          .hero-button {
            padding: 14px 32px;
            font-size: 1.1rem;
            font-weight: 600;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .hero-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
        `,
        traits: [
          {
            type: "text",
            name: "title",
            label: "Title",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "subtitle",
            label: "Subtitle",
            changeProp: true,
          },
          {
            type: "text",
            name: "buttonText",
            label: "Button Text",
            changeProp: true,
          },
          {
            type: "text",
            name: "backgroundImage",
            label: "Background Image URL",
            changeProp: true,
          },
        ],
        title: "Welcome to Our Platform",
        subtitle: "Build amazing websites with ease and create stunning digital experiences",
        buttonText: "Get Started",
        backgroundImage: "https://picsum.photos/seed/hero/1200/600",
        components: `
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1 class="hero-title">Welcome to Our Platform</h1>
            <p class="hero-subtitle">Build amazing websites with ease and create stunning digital experiences</p>
            <button class="hero-button">Get Started</button>
          </div>
        `,
        style: {
          backgroundImage: "url('https://picsum.photos/seed/hero/1200/600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      },
      init() {
        this.on("change:title change:subtitle change:buttonText change:backgroundImage", this.updateContent);
        this.updateContent();
      },
      updateContent() {
        const title = this.get("title");
        const subtitle = this.get("subtitle");
        const buttonText = this.get("buttonText");
        const bgImage = this.get("backgroundImage");
        
        const el = this.getEl();
        if (el) {
          el.style.backgroundImage = `url('${bgImage}')`;
        }
        
        this.components(`
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1 class="hero-title">${title}</h1>
            <p class="hero-subtitle">${subtitle}</p>
            <button class="hero-button">${buttonText}</button>
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("hero-section", {
    label: "Hero Section",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><rect x="3" y="5" width="18" height="12" rx="2" ry="2" fill="none" stroke="#e8eaed" stroke-width="1.5"/><path d="M7 14h10M8 9h8" stroke="#e8eaed" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="19" r="1" fill="#e8eaed"/></svg>',
    content: {
      type: "hero-section",
    },
  });
};

