import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const breadcrumbPlugin = (editor: Editor) => {
  editor.Components.addType("breadcrumb", {
    isComponent: (el: any) => el.classList?.contains("breadcrumb"),
    model: {
      defaults: {
        tagName: "nav",
        attributes: { class: "breadcrumb" },
        styles: `
          .breadcrumb {
            padding: 20px 40px;
            background: #f8f9fa;
          }
          .breadcrumb-list {
            display: flex;
            align-items: center;
            gap: 8px;
            list-style: none;
            margin: 0;
            padding: 0;
            font-size: 0.95rem;
          }
          .breadcrumb-item {
            color: #666;
          }
          .breadcrumb-item a {
            color: #667eea;
            text-decoration: none;
            transition: color 0.3s;
          }
          .breadcrumb-item a:hover {
            color: #764ba2;
          }
          .breadcrumb-separator {
            color: #999;
            margin: 0 4px;
          }
        `,
        traits: [
          {
            type: "text",
            name: "items",
            label: "Breadcrumb Items (comma separated)",
            changeProp: true,
          },
        ],
        items: "Home, About, Services",
        components: `
          <ul class="breadcrumb-list">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <span class="breadcrumb-separator">/</span>
            <li class="breadcrumb-item"><a href="#">About</a></li>
            <span class="breadcrumb-separator">/</span>
            <li class="breadcrumb-item">Services</li>
          </ul>
        `,
      },
      init() {
        this.on("change:items", this.updateContent);
      },
      updateContent() {
        const items = this.get("items");
        const itemsArray = items.split(",").map((item: string) => item.trim());
        const lastIndex = itemsArray.length - 1;
        
        const itemsHtml = itemsArray.map((item: string, index: number) => {
          if (index === lastIndex) {
            return `<li class="breadcrumb-item">${item}</li>`;
          }
          return `
            <li class="breadcrumb-item"><a href="#">${item}</a></li>
            <span class="breadcrumb-separator">/</span>
          `;
        }).join("");

        this.components(`
          <ul class="breadcrumb-list">
            ${itemsHtml}
          </ul>
        `);
      },
    },
  });
  
  editor.Blocks.add("breadcrumb", {
    label: "Breadcrumb",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M240-120 80-280l160-160 57 57-103 103 103 103-57 57Zm240 0v-160h360v160H480Z"/></svg>',
    content: {
      type: "breadcrumb",
    },
  });
};

