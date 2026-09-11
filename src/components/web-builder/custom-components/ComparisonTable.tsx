import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const comparisonTablePlugin = (editor: Editor) => {
  editor.Components.addType("comparison-table", {
    isComponent: (el: any) => el.classList?.contains("comparison-table"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "comparison-table" },
        styles: `
          .comparison-table {
            max-width: 900px;
            margin: 0 auto;
            overflow-x: auto;
          }
          .comparison-table-title {
            font-size: 2rem;
            font-weight: 800;
            text-align: center;
            color: #1a1a1a;
            margin-bottom: 28px;
          }
          .comparison-table table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          }
          .comparison-table th,
          .comparison-table td {
            padding: 16px 20px;
            text-align: center;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.98rem;
          }
          .comparison-table th {
            background: #f8f9ff;
            font-weight: 700;
            color: #1a1a1a;
          }
          .comparison-table td:first-child,
          .comparison-table th:first-child {
            text-align: left;
            font-weight: 600;
            color: #444;
          }
          .comparison-table tr:last-child td {
            border-bottom: none;
          }
          .comparison-table-highlight {
            background: #f0eeff;
          }
          .comparison-table-check {
            color: #2e7d32;
            font-size: 1.15rem;
            font-weight: 700;
          }
          .comparison-table-cross {
            color: #ccc;
            font-size: 1.15rem;
            font-weight: 700;
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
            type: "text",
            name: "planNames",
            label: "Plan Names (comma separated)",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "features",
            label: "Features (one per line: Feature | y,n,y)",
            changeProp: true,
          },
          {
            type: "number",
            name: "highlightColumn",
            label: "Highlight Column (0 = none)",
            changeProp: true,
          },
        ],
        title: "Compare Plans",
        planNames: "Basic, Pro, Enterprise",
        features:
          "Unlimited Projects | n,y,y\n" +
          "Priority Support | n,n,y\n" +
          "Custom Domain | y,y,y\n" +
          "API Access | n,y,y\n" +
          "Team Collaboration | n,y,y",
        highlightColumn: 2,
        components: `
          <h2 class="comparison-table-title">Compare Plans</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Basic</th>
                <th class="comparison-table-highlight">Pro</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Unlimited Projects</td><td><span class="comparison-table-cross">✕</span></td><td class="comparison-table-highlight"><span class="comparison-table-check">✓</span></td><td><span class="comparison-table-check">✓</span></td></tr>
              <tr><td>Priority Support</td><td><span class="comparison-table-cross">✕</span></td><td class="comparison-table-highlight"><span class="comparison-table-cross">✕</span></td><td><span class="comparison-table-check">✓</span></td></tr>
              <tr><td>Custom Domain</td><td><span class="comparison-table-check">✓</span></td><td class="comparison-table-highlight"><span class="comparison-table-check">✓</span></td><td><span class="comparison-table-check">✓</span></td></tr>
              <tr><td>API Access</td><td><span class="comparison-table-cross">✕</span></td><td class="comparison-table-highlight"><span class="comparison-table-check">✓</span></td><td><span class="comparison-table-check">✓</span></td></tr>
              <tr><td>Team Collaboration</td><td><span class="comparison-table-cross">✕</span></td><td class="comparison-table-highlight"><span class="comparison-table-check">✓</span></td><td><span class="comparison-table-check">✓</span></td></tr>
            </tbody>
          </table>
        `,
      },
      init() {
        this.on("change:title change:planNames change:features change:highlightColumn", this.updateContent);
        // Only seed the placeholder rows for a genuinely new component
        // (dropped from the block panel, so it has no children yet) — never
        // when parsing an existing website's real HTML into this type.
        if (!this.components().length) {
          this.updateContent();
        }
      },
      updateContent() {
        const title = this.get("title");
        const planNames = this.get("planNames");
        const features = this.get("features");
        const highlightColumn = parseInt(this.get("highlightColumn"), 10) || 0;

        const plans = (planNames || "")
          .split(",")
          .map((name: string) => name.trim())
          .filter((name: string) => name.length > 0);

        const rows = (features || "")
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);

        const headerCells = plans
          .map((name: string, index: number) => {
            const highlightClass = index + 1 === highlightColumn ? ' class="comparison-table-highlight"' : "";
            return `<th${highlightClass}>${name}</th>`;
          })
          .join("");

        const bodyRows = rows
          .map((line: string) => {
            const [featureName, valuesStr] = line.split("|").map((part: string) => part.trim());
            const values = (valuesStr || "").split(",").map((v: string) => v.trim().toLowerCase());
            const cells = plans
              .map((_planName: string, index: number) => {
                const highlightClass = index + 1 === highlightColumn ? "comparison-table-highlight" : "";
                const isYes = values[index] === "y" || values[index] === "yes";
                const icon = isYes
                  ? '<span class="comparison-table-check">✓</span>'
                  : '<span class="comparison-table-cross">✕</span>';
                return `<td class="${highlightClass}">${icon}</td>`;
              })
              .join("");
            return `<tr><td>${featureName || ""}</td>${cells}</tr>`;
          })
          .join("");

        this.components(`
          <h2 class="comparison-table-title">${title}</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                ${headerCells}
              </tr>
            </thead>
            <tbody>
              ${bodyRows}
            </tbody>
          </table>
        `);
      },
    },
  });

  editor.Blocks.add("comparison-table", {
    label: "Comparison Table",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#e8eaed" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="20"/><line x1="15" y1="9" x2="15" y2="20"/><path d="M11 14.5l1.5 1.5 2.5-3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    content: {
      type: "comparison-table",
    },
  });
};
