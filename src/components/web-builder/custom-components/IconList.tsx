import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

const ICON_MAP: Record<string, string> = {
  check: "✓",
  arrow: "→",
  star: "★",
  dot: "●",
};

export const iconListPlugin = (editor: Editor) => {
  editor.Components.addType("icon-list", {
    isComponent: (el: any) => el.classList?.contains("icon-list"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "icon-list" },
        styles: `
          .icon-list {
            max-width: 600px;
            margin: 0 auto;
          }
          .icon-list-title {
            font-size: 1.8rem;
            font-weight: 800;
            color: #1a1a1a;
            margin-bottom: 20px;
          }
          .icon-list-items {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .icon-list-items.icon-list-two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 24px;
          }
          .icon-list-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 10px 0;
            font-size: 1.05rem;
            line-height: 1.5;
            color: #333;
          }
          .icon-list-icon {
            flex-shrink: 0;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            font-size: 0.8rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .icon-list-text {
            padding-top: 3px;
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
            name: "items",
            label: "Items (one per line)",
            changeProp: true,
          },
          {
            type: "select",
            name: "iconStyle",
            label: "Icon Style",
            options: [
              { id: "check", label: "Checkmark" },
              { id: "arrow", label: "Arrow" },
              { id: "star", label: "Star" },
              { id: "dot", label: "Dot" },
            ],
            changeProp: true,
          },
          {
            type: "checkbox",
            name: "twoColumn",
            label: "Two Columns",
            changeProp: true,
          },
        ],
        title: "What's Included",
        items:
          "Unlimited revisions\n" +
          "24/7 customer support\n" +
          "Free domain for 1 year\n" +
          "SSL certificate included\n" +
          "Priority onboarding",
        iconStyle: "check",
        twoColumn: false,
        components: `
          <h3 class="icon-list-title">What's Included</h3>
          <ul class="icon-list-items">
            <li class="icon-list-item"><span class="icon-list-icon">✓</span><span class="icon-list-text">Unlimited revisions</span></li>
            <li class="icon-list-item"><span class="icon-list-icon">✓</span><span class="icon-list-text">24/7 customer support</span></li>
            <li class="icon-list-item"><span class="icon-list-icon">✓</span><span class="icon-list-text">Free domain for 1 year</span></li>
            <li class="icon-list-item"><span class="icon-list-icon">✓</span><span class="icon-list-text">SSL certificate included</span></li>
            <li class="icon-list-item"><span class="icon-list-icon">✓</span><span class="icon-list-text">Priority onboarding</span></li>
          </ul>
        `,
      },
      init() {
        this.on("change:title change:items change:iconStyle change:twoColumn", this.updateContent);
        // Only seed the placeholder items for a genuinely new component
        // (dropped from the block panel, so it has no children yet) — never
        // when parsing an existing website's real HTML into this type.
        if (!this.components().length) {
          this.updateContent();
        }
      },
      updateContent() {
        const title = this.get("title");
        const items = this.get("items");
        const iconStyle = this.get("iconStyle") || "check";
        const twoColumn = this.get("twoColumn");
        const icon = ICON_MAP[iconStyle] || ICON_MAP.check;

        const rows = (items || "")
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);

        const itemsHtml = rows
          .map(
            (line: string) =>
              `<li class="icon-list-item"><span class="icon-list-icon">${icon}</span><span class="icon-list-text">${line}</span></li>`
          )
          .join("");

        const listClass = twoColumn ? "icon-list-items icon-list-two-col" : "icon-list-items";

        this.components(`
          <h3 class="icon-list-title">${title}</h3>
          <ul class="${listClass}">
            ${itemsHtml}
          </ul>
        `);
      },
    },
  });

  editor.Blocks.add("icon-list", {
    label: "Icon List",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#e8eaed" stroke-width="1.5"><path d="M4 6l2 2 3-3" stroke-linecap="round" stroke-linejoin="round"/><line x1="11" y1="6" x2="21" y2="6" stroke-linecap="round"/><path d="M4 13l2 2 3-3" stroke-linecap="round" stroke-linejoin="round"/><line x1="11" y1="13" x2="21" y2="13" stroke-linecap="round"/><path d="M4 20l2 2 3-3" stroke-linecap="round" stroke-linejoin="round"/><line x1="11" y1="20" x2="21" y2="20" stroke-linecap="round"/></svg>',
    content: {
      type: "icon-list",
    },
  });
};
