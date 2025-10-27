import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const featureBoxPlugin = (editor: Editor) => {
  editor.Components.addType("feature-box", {
    isComponent: (el: any) => el.classList?.contains("feature-box"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "feature-box" },
        styles: `
          .feature-box {
            padding: 40px 30px;
            border-radius: 20px;
            background: #fff;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .feature-box:hover {
            transform: translateY(-10px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }
          .feature-box-icon {
            font-size: 4rem;
            margin-bottom: 20px;
            display: block;
          }
          .feature-box-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 16px;
            color: #1a1a1a;
          }
          .feature-box-description {
            font-size: 1rem;
            line-height: 1.7;
            color: #666;
          }
        `,
        traits: [
          {
            type: "text",
            name: "title",
            label: "Feature Title",
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
            name: "icon",
            label: "Icon (Emoji)",
            changeProp: true,
          },
        ],
        title: "Feature Title",
        description: "Add a detailed description of your feature here. This helps users understand the value and benefits.",
        icon: "🚀",
        components: `
          <div class="feature-box-icon">🚀</div>
          <h3 class="feature-box-title">Feature Title</h3>
          <p class="feature-box-description">Add a detailed description of your feature here. This helps users understand the value and benefits.</p>
        `,
      },
      init() {
        this.on("change:title change:description change:icon", this.updateContent);
      },
      updateContent() {
        const title = this.get("title");
        const description = this.get("description");
        const icon = this.get("icon");

        this.components(`
          <div class="feature-box-icon">${icon}</div>
          <h3 class="feature-box-title">${title}</h3>
          <p class="feature-box-description">${description}</p>
        `);
      },
    },
  });
  
  editor.Blocks.add("feature-box", {
    label: "Feature Box",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-360 195v240L880-600 480-840 80-600l360 208v272Zm-49-209 300-163-300-163-300 163 300 163Zm0 0L131-492l300-163 300 163-300 163Z"/></svg>',
    content: {
      type: "feature-box",
    },
  });
};

