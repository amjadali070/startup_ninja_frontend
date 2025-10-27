import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const ctaSectionPlugin = (editor: Editor) => {
  editor.Components.addType("cta-section", {
    isComponent: (el: any) => el.classList?.contains("cta-section"),
    model: {
      defaults: {
        tagName: "section",
        attributes: { class: "cta-section" },
        styles: `
          .cta-section {
            padding: 80px 40px;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 24px;
            color: #fff;
            margin: 40px 0;
          }
          .cta-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.2;
          }
          .cta-description {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.95;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
          }
          .cta-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .cta-button {
            padding: 16px 36px;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 50px;
            border: 2px solid #fff;
            cursor: pointer;
            transition: all 0.3s;
          }
          .cta-button-primary {
            background: #fff;
            color: #667eea;
          }
          .cta-button-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }
          .cta-button-secondary {
            background: transparent;
            color: #fff;
          }
          .cta-button-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
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
            name: "description",
            label: "Description",
            changeProp: true,
          },
          {
            type: "text",
            name: "primaryButton",
            label: "Primary Button Text",
            changeProp: true,
          },
          {
            type: "text",
            name: "secondaryButton",
            label: "Secondary Button Text",
            changeProp: true,
          },
        ],
        title: "Ready to Get Started?",
        description: "Join thousands of satisfied customers and start building your dream website today.",
        primaryButton: "Get Started",
        secondaryButton: "Learn More",
        components: `
          <h2 class="cta-title">Ready to Get Started?</h2>
          <p class="cta-description">Join thousands of satisfied customers and start building your dream website today.</p>
          <div class="cta-buttons">
            <button class="cta-button cta-button-primary">Get Started</button>
            <button class="cta-button cta-button-secondary">Learn More</button>
          </div>
        `,
      },
      init() {
        this.on("change:title change:description change:primaryButton change:secondaryButton", this.updateContent);
      },
      updateContent() {
        const title = this.get("title");
        const description = this.get("description");
        const primaryButton = this.get("primaryButton");
        const secondaryButton = this.get("secondaryButton");

        this.components(`
          <h2 class="cta-title">${title}</h2>
          <p class="cta-description">${description}</p>
          <div class="cta-buttons">
            <button class="cta-button cta-button-primary">${primaryButton}</button>
            <button class="cta-button cta-button-secondary">${secondaryButton}</button>
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("cta-section", {
    label: "CTA Section",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-360 195v240L880-600 480-840 80-600l360 208v272Zm-49-209 300-163-300-163-300 163 300 163Zm0 0L131-492l300-163 300 163-300 163Z"/></svg>',
    content: {
      type: "cta-section",
    },
  });
};

