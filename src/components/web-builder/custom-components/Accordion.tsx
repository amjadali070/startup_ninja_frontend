import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const accordionPlugin = (editor: Editor) => {
  // Named "faq-accordion" (not "accordion") — the SDK's own built-in
  // accordionComponent plugin registers a component type keyed "accordion"
  // too, and since it initializes after this one in WebsiteBuilderStudio's
  // plugins array, it silently won the naming collision: dropping this
  // block instantiated the SDK's generic accordion instead of this one,
  // with none of the real FAQ content ever appearing.
  editor.Components.addType("faq-accordion", {
    isComponent: (el: any) => el.classList?.contains("faq-accordion"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "faq-accordion" },
        styles: `
          .faq-accordion {
            max-width: 800px;
            margin: 0 auto;
          }
          .accordion-title {
            font-size: 2rem;
            font-weight: 800;
            text-align: center;
            color: #1a1a1a;
            margin-bottom: 24px;
          }
          .accordion-item {
            border-bottom: 1px solid #eee;
          }
          .accordion-item:first-child {
            border-top: 1px solid #eee;
          }
          .accordion-summary {
            padding: 20px 4px;
            font-weight: 700;
            font-size: 1.1rem;
            color: #1a1a1a;
            cursor: pointer;
            list-style: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }
          .accordion-summary::-webkit-details-marker {
            display: none;
          }
          .accordion-icon {
            flex-shrink: 0;
            font-size: 1.4rem;
            font-weight: 400;
            color: #667eea;
            transition: transform 0.2s;
          }
          .accordion-item[open] .accordion-icon {
            transform: rotate(45deg);
          }
          .accordion-panel {
            padding: 0 4px 20px 4px;
            color: #666;
            font-size: 1rem;
            line-height: 1.7;
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
            label: "Items (one per line: Question | Answer)",
            changeProp: true,
          },
          {
            type: "checkbox",
            name: "openFirst",
            label: "Open First Item",
            changeProp: true,
          },
        ],
        title: "Frequently Asked Questions",
        items:
          "How do I get started? | Sign up for a free account and follow our onboarding guide to launch your first project in minutes.\n" +
          "Can I cancel anytime? | Yes, you can cancel or change your plan at any time from your account settings.\n" +
          "Do you offer support? | Our support team is available 24/7 via chat and email to help with any questions.\n" +
          "Is there a free trial? | Yes, every plan includes a 14-day free trial with full access to all features.",
        openFirst: true,
        components: `
          <h2 class="accordion-title">Frequently Asked Questions</h2>
          <details class="accordion-item" open>
            <summary class="accordion-summary"><span>How do I get started?</span><span class="accordion-icon">+</span></summary>
            <div class="accordion-panel">Sign up for a free account and follow our onboarding guide to launch your first project in minutes.</div>
          </details>
          <details class="accordion-item">
            <summary class="accordion-summary"><span>Can I cancel anytime?</span><span class="accordion-icon">+</span></summary>
            <div class="accordion-panel">Yes, you can cancel or change your plan at any time from your account settings.</div>
          </details>
          <details class="accordion-item">
            <summary class="accordion-summary"><span>Do you offer support?</span><span class="accordion-icon">+</span></summary>
            <div class="accordion-panel">Our support team is available 24/7 via chat and email to help with any questions.</div>
          </details>
          <details class="accordion-item">
            <summary class="accordion-summary"><span>Is there a free trial?</span><span class="accordion-icon">+</span></summary>
            <div class="accordion-panel">Yes, every plan includes a 14-day free trial with full access to all features.</div>
          </details>
        `,
      },
      init() {
        this.on("change:title change:items change:openFirst", this.updateContent);
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
        const openFirst = this.get("openFirst");

        const rows = (items || "")
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);

        const itemsHtml = rows
          .map((line: string, index: number) => {
            const [question, answer] = line.split("|").map((part: string) => part.trim());
            const openAttr = index === 0 && openFirst ? " open" : "";
            return `
              <details class="accordion-item"${openAttr}>
                <summary class="accordion-summary"><span>${question || ""}</span><span class="accordion-icon">+</span></summary>
                <div class="accordion-panel">${answer || ""}</div>
              </details>
            `;
          })
          .join("");

        this.components(`
          <h2 class="accordion-title">${title}</h2>
          ${itemsHtml}
        `);
      },
    },
  });

  editor.Blocks.add("faq-accordion", {
    label: "Accordion",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#e8eaed" stroke-width="1.5"><rect x="3" y="4" width="18" height="5" rx="1"/><rect x="3" y="11" width="18" height="5" rx="1"/><line x1="6" y1="19" x2="14" y2="19" stroke-linecap="round"/><path d="M16 18l2 2 2-2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    content: {
      type: "faq-accordion",
    },
  });
};
