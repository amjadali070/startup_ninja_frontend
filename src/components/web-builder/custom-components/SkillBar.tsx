import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const skillBarPlugin = (editor: Editor) => {
  editor.Components.addType("skill-bars", {
    isComponent: (el: any) => el.classList?.contains("skill-bars"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "skill-bars" },
        styles: `
          .skill-bars {
            max-width: 600px;
            margin: 0 auto;
          }
          .skill-bars-title {
            font-size: 1.8rem;
            font-weight: 800;
            color: #1a1a1a;
            margin-bottom: 28px;
          }
          .skill-bar-item {
            margin-bottom: 20px;
          }
          .skill-bar-item:last-child {
            margin-bottom: 0;
          }
          .skill-bar-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.95rem;
            font-weight: 600;
            color: #333;
          }
          .skill-bar-track {
            width: 100%;
            height: 10px;
            background: #eef0f7;
            border-radius: 50px;
            overflow: hidden;
          }
          .skill-bar-fill {
            height: 100%;
            border-radius: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: width 0.4s;
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
            name: "skills",
            label: "Skills (one per line: Label | Percent)",
            changeProp: true,
          },
          {
            type: "checkbox",
            name: "showPercentage",
            label: "Show Percentage",
            changeProp: true,
          },
          {
            type: "text",
            name: "barColor",
            label: "Bar Color",
            changeProp: true,
          },
        ],
        title: "My Skills",
        skills:
          "React | 90\n" +
          "JavaScript | 95\n" +
          "Node.js | 85\n" +
          "UI/UX Design | 75\n" +
          "Project Management | 80",
        showPercentage: true,
        barColor: "#667eea",
        components: `
          <h2 class="skill-bars-title">My Skills</h2>
          <div class="skill-bar-item">
            <div class="skill-bar-label"><span>React</span><span>90%</span></div>
            <div class="skill-bar-track"><div class="skill-bar-fill" style="width:90%"></div></div>
          </div>
          <div class="skill-bar-item">
            <div class="skill-bar-label"><span>JavaScript</span><span>95%</span></div>
            <div class="skill-bar-track"><div class="skill-bar-fill" style="width:95%"></div></div>
          </div>
          <div class="skill-bar-item">
            <div class="skill-bar-label"><span>Node.js</span><span>85%</span></div>
            <div class="skill-bar-track"><div class="skill-bar-fill" style="width:85%"></div></div>
          </div>
          <div class="skill-bar-item">
            <div class="skill-bar-label"><span>UI/UX Design</span><span>75%</span></div>
            <div class="skill-bar-track"><div class="skill-bar-fill" style="width:75%"></div></div>
          </div>
          <div class="skill-bar-item">
            <div class="skill-bar-label"><span>Project Management</span><span>80%</span></div>
            <div class="skill-bar-track"><div class="skill-bar-fill" style="width:80%"></div></div>
          </div>
        `,
      },
      init() {
        this.on("change:title change:skills change:showPercentage change:barColor", this.updateContent);
        // Only seed the placeholder skills for a genuinely new component
        // (dropped from the block panel, so it has no children yet) — never
        // when parsing an existing website's real HTML into this type.
        if (!this.components().length) {
          this.updateContent();
        }
      },
      updateContent() {
        const title = this.get("title");
        const skills = this.get("skills");
        const showPercentage = this.get("showPercentage");
        const barColor = this.get("barColor") || "#667eea";

        const rows = (skills || "")
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);

        const itemsHtml = rows
          .map((line: string) => {
            const [label, percentStr] = line.split("|").map((part: string) => part.trim());
            let percent = parseInt(percentStr, 10);
            if (isNaN(percent)) percent = 0;
            percent = Math.max(0, Math.min(100, percent));
            const percentLabel = showPercentage ? `<span>${percent}%</span>` : "";

            return `
              <div class="skill-bar-item">
                <div class="skill-bar-label"><span>${label || ""}</span>${percentLabel}</div>
                <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${percent}%;background:${barColor}"></div></div>
              </div>
            `;
          })
          .join("");

        this.components(`
          <h2 class="skill-bars-title">${title}</h2>
          ${itemsHtml}
        `);
      },
    },
  });

  editor.Blocks.add("skill-bars", {
    label: "Skill Bars",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#e8eaed" stroke-width="1.5"><line x1="3" y1="6" x2="18" y2="6" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke-linecap="round"/><line x1="3" y1="18" x2="13" y2="18" stroke-linecap="round"/></svg>',
    content: {
      type: "skill-bars",
    },
  });
};
