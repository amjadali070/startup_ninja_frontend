import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const logoCloudPlugin = (editor: Editor) => {
  editor.Components.addType("logo-cloud", {
    isComponent: (el: any) => el.classList?.contains("logo-cloud"),
    model: {
      defaults: {
        tagName: "section",
        attributes: { class: "logo-cloud" },
        styles: `
          .logo-cloud {
            padding: 50px 30px;
            text-align: center;
            background: #fafafa;
          }
          .logo-cloud-heading {
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #999;
            margin-bottom: 28px;
          }
          .logo-cloud-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
          .logo-cloud-pill {
            padding: 12px 28px;
            background: #fff;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.05rem;
            color: #555;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
            border: 1px solid #eee;
          }
          .logo-cloud-pill-outline {
            background: transparent;
            box-shadow: none;
            border: 1.5px solid #ddd;
          }
          .logo-cloud-note {
            margin-top: 24px;
            font-size: 0.95rem;
            color: #999;
          }
        `,
        traits: [
          {
            type: "text",
            name: "heading",
            label: "Heading",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "logos",
            label: "Company Names (one per line)",
            changeProp: true,
          },
          {
            type: "text",
            name: "note",
            label: "Note (optional)",
            changeProp: true,
          },
          {
            type: "select",
            name: "pillStyle",
            label: "Pill Style",
            options: [
              { id: "solid", label: "Solid" },
              { id: "outline", label: "Outline" },
            ],
            changeProp: true,
          },
        ],
        heading: "Trusted by teams at",
        logos: "Acme Inc\nGlobex\nInitech\nUmbrella Corp\nStark Industries",
        note: "Join hundreds of companies already growing with us.",
        pillStyle: "solid",
        components: `
          <div class="logo-cloud-heading">Trusted by teams at</div>
          <div class="logo-cloud-row">
            <span class="logo-cloud-pill">Acme Inc</span>
            <span class="logo-cloud-pill">Globex</span>
            <span class="logo-cloud-pill">Initech</span>
            <span class="logo-cloud-pill">Umbrella Corp</span>
            <span class="logo-cloud-pill">Stark Industries</span>
          </div>
          <div class="logo-cloud-note">Join hundreds of companies already growing with us.</div>
        `,
      },
      init() {
        this.on("change:heading change:logos change:note change:pillStyle", this.updateContent);
        if (!this.components().length) {
          this.updateContent();
        }
      },
      updateContent() {
        const heading = this.get("heading");
        const logos = this.get("logos");
        const note = this.get("note");
        const pillStyle = this.get("pillStyle");

        const pillClass = pillStyle === "outline" ? "logo-cloud-pill logo-cloud-pill-outline" : "logo-cloud-pill";

        const logoNames = (logos || "")
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);

        const pillsHtml = logoNames
          .map((name: string) => `<span class="${pillClass}">${name}</span>`)
          .join("");

        const noteHtml = note ? `<div class="logo-cloud-note">${note}</div>` : "";

        this.components(`
          <div class="logo-cloud-heading">${heading}</div>
          <div class="logo-cloud-row">
            ${pillsHtml}
          </div>
          ${noteHtml}
        `);
      },
    },
  });

  editor.Blocks.add("logo-cloud", {
    label: "Logo Cloud",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#e8eaed" stroke-width="1.5"><rect x="2" y="9" width="5.5" height="6" rx="1"/><rect x="9.25" y="9" width="5.5" height="6" rx="1"/><rect x="16.5" y="9" width="5.5" height="6" rx="1"/></svg>',
    content: {
      type: "logo-cloud",
    },
  });
};
