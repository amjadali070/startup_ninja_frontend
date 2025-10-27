import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const sectionSeparatorPlugin = (editor: Editor) => {
  editor.Components.addType("section-separator", {
    isComponent: (el: any) => el.classList?.contains("section-separator"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "section-separator" },
        styles: `
          .section-separator {
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%);
            margin: 60px 0;
            position: relative;
          }
          .section-separator::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
        `,
        components: `<div></div>`,
      },
      init() {},
      updateContent() {},
    },
  });
  
  editor.Blocks.add("section-separator", {
    label: "Section Separator",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm0-60q122 0 211-89t89-211q0-122-89-211t-211-89q-122 0-211 89t-89 211q0 122 89 211t211 89Zm0-160Z"/></svg>',
    content: {
      type: "section-separator",
    },
  });
};

