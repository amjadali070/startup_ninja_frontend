import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const timelinePlugin = (editor: Editor) => {
  editor.Components.addType("timeline-section", {
    isComponent: (el: any) => el.classList?.contains("timeline-section"),
    model: {
      defaults: {
        tagName: "section",
        attributes: { class: "timeline-section" },
        styles: `
          .timeline-section {
            padding: 60px 30px;
            max-width: 800px;
            margin: 0 auto;
          }
          .timeline-header {
            text-align: center;
            margin-bottom: 48px;
          }
          .timeline-title {
            font-size: 2.2rem;
            font-weight: 800;
            color: #1a1a1a;
            margin-bottom: 12px;
          }
          .timeline-subtitle {
            font-size: 1.05rem;
            color: #666;
            line-height: 1.6;
          }
          .timeline-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .timeline-item {
            display: flex;
            gap: 20px;
          }
          .timeline-item-marker-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-shrink: 0;
          }
          .timeline-item-marker {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1rem;
          }
          .timeline-item-line {
            width: 2px;
            flex: 1;
            min-height: 24px;
            background: #e0e0e0;
            margin-top: 6px;
          }
          .timeline-item:last-child .timeline-item-line {
            display: none;
          }
          .timeline-item-body {
            padding-bottom: 36px;
          }
          .timeline-item-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
          }
          .timeline-item-desc {
            font-size: 1rem;
            line-height: 1.6;
            color: #666;
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
            type: "textarea",
            name: "steps",
            label: "Steps (one per line: Title | Description)",
            changeProp: true,
          },
          {
            type: "text",
            name: "accentColor",
            label: "Marker Color",
            changeProp: true,
          },
        ],
        title: "Our Process",
        subtitle: "A simple step-by-step overview of how we work with you.",
        steps:
          "Discovery | We learn about your goals, audience, and requirements.\n" +
          "Design | We craft a look and feel that matches your brand.\n" +
          "Development | We build and test your website end to end.\n" +
          "Launch | We deploy your site and support you after go-live.",
        accentColor: "#667eea",
        components: `
          <div class="timeline-header">
            <h2 class="timeline-title">Our Process</h2>
            <p class="timeline-subtitle">A simple step-by-step overview of how we work with you.</p>
          </div>
          <ul class="timeline-list">
            <li class="timeline-item">
              <div class="timeline-item-marker-col">
                <div class="timeline-item-marker" style="background:#667eea">1</div>
                <div class="timeline-item-line"></div>
              </div>
              <div class="timeline-item-body">
                <h3 class="timeline-item-title">Discovery</h3>
                <p class="timeline-item-desc">We learn about your goals, audience, and requirements.</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-item-marker-col">
                <div class="timeline-item-marker" style="background:#667eea">2</div>
                <div class="timeline-item-line"></div>
              </div>
              <div class="timeline-item-body">
                <h3 class="timeline-item-title">Design</h3>
                <p class="timeline-item-desc">We craft a look and feel that matches your brand.</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-item-marker-col">
                <div class="timeline-item-marker" style="background:#667eea">3</div>
                <div class="timeline-item-line"></div>
              </div>
              <div class="timeline-item-body">
                <h3 class="timeline-item-title">Development</h3>
                <p class="timeline-item-desc">We build and test your website end to end.</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-item-marker-col">
                <div class="timeline-item-marker" style="background:#667eea">4</div>
                <div class="timeline-item-line"></div>
              </div>
              <div class="timeline-item-body">
                <h3 class="timeline-item-title">Launch</h3>
                <p class="timeline-item-desc">We deploy your site and support you after go-live.</p>
              </div>
            </li>
          </ul>
        `,
      },
      init() {
        this.on("change:title change:subtitle change:steps change:accentColor", this.updateContent);
        // Only seed placeholder steps for a genuinely new component (dropped
        // from the block panel, so it has no children yet). Parsing an
        // existing website's real HTML into this type must never overwrite
        // it with these hardcoded defaults.
        if (!this.components().length) {
          this.updateContent();
        }
      },
      updateContent() {
        const title = this.get("title");
        const subtitle = this.get("subtitle");
        const steps = this.get("steps");
        const accentColor = this.get("accentColor") || "#667eea";

        const stepRows = (steps || "")
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);

        const itemsHtml = stepRows
          .map((line: string, index: number) => {
            const [stepTitle, stepDesc] = line.split("|").map((part: string) => part.trim());
            return `
              <li class="timeline-item">
                <div class="timeline-item-marker-col">
                  <div class="timeline-item-marker" style="background:${accentColor}">${index + 1}</div>
                  <div class="timeline-item-line"></div>
                </div>
                <div class="timeline-item-body">
                  <h3 class="timeline-item-title">${stepTitle || ""}</h3>
                  <p class="timeline-item-desc">${stepDesc || ""}</p>
                </div>
              </li>
            `;
          })
          .join("");

        this.components(`
          <div class="timeline-header">
            <h2 class="timeline-title">${title}</h2>
            <p class="timeline-subtitle">${subtitle}</p>
          </div>
          <ul class="timeline-list">
            ${itemsHtml}
          </ul>
        `);
      },
    },
  });

  editor.Blocks.add("timeline-section", {
    label: "Timeline",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#e8eaed" stroke-width="1.5"><line x1="6" y1="4" x2="6" y2="20"/><circle cx="6" cy="5" r="2" fill="#e8eaed" stroke="none"/><circle cx="6" cy="12" r="2" fill="#e8eaed" stroke="none"/><circle cx="6" cy="19" r="2" fill="#e8eaed" stroke="none"/><line x1="11" y1="5" x2="20" y2="5" stroke-linecap="round"/><line x1="11" y1="12" x2="20" y2="12" stroke-linecap="round"/><line x1="11" y1="19" x2="20" y2="19" stroke-linecap="round"/></svg>',
    content: {
      type: "timeline-section",
    },
  });
};
