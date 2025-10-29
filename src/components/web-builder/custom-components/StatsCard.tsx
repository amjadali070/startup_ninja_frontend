import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const statsCardPlugin = (editor: Editor) => {
  editor.Components.addType("stats-card", {
    isComponent: (el: any) => el.classList?.contains("stats-card"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "stats-card" },
        styles: `
          .stats-card {
            text-align: center;
            padding: 40px 30px;
            border-radius: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
          }
          .stats-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
          }
          .stats-number {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 12px;
            line-height: 1;
            background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .stats-label {
            font-size: 1.2rem;
            font-weight: 600;
            opacity: 0.95;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
        `,
        traits: [
          {
            type: "text",
            name: "number",
            label: "Number/Stat",
            changeProp: true,
          },
          {
            type: "text",
            name: "label",
            label: "Label",
            changeProp: true,
          },
        ],
        number: "1000+",
        label: "Happy Customers",
        components: `
          <div class="stats-number">1000+</div>
          <div class="stats-label">Happy Customers</div>
        `,
      },
      init() {
        this.on("change:number change:label", this.updateContent);
      },
      updateContent() {
        const number = this.get("number");
        const label = this.get("label");

        this.components(`
          <div class="stats-number">${number}</div>
          <div class="stats-label">${label}</div>
        `);
      },
    },
  });
  
  editor.Blocks.add("stats-card", {
    label: "Stats Card",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><path d="M3 3h2v18H3zM7 13h2v8H7zM11 9h2v12h-2zM15 5h2v16h-2zM19 1h2v20h-2z"/></svg>',
    content: {
      type: "stats-card",
    },
  });
};

