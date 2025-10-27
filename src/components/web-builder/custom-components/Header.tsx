import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const headerPlugin = (editor: Editor) => {
  editor.Components.addType("header", {
    isComponent: (el: any) => el.classList?.contains("header"),
    model: {
      defaults: {
        tagName: "header",
        attributes: { class: "header" },
        styles: `
          .header {
            background: #fff;
            padding: 20px 40px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          .header-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
          }
          .header-logo {
            font-size: 1.5rem;
            font-weight: 800;
            color: #667eea;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .header-menu {
            display: flex;
            gap: 32px;
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .header-menu li {
            font-size: 1rem;
            font-weight: 500;
            color: #1a1a1a;
            cursor: pointer;
            transition: color 0.3s;
          }
          .header-menu li:hover {
            color: #667eea;
          }
          .header-cta {
            padding: 10px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .header-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
        `,
        traits: [
          {
            type: "text",
            name: "logo",
            label: "Logo Text",
            changeProp: true,
          },
          {
            type: "text",
            name: "menuItems",
            label: "Menu Items (comma separated)",
            changeProp: true,
          },
          {
            type: "text",
            name: "ctaText",
            label: "CTA Button Text",
            changeProp: true,
          },
        ],
        logo: "YourLogo",
        menuItems: "Home, About, Services, Contact",
        ctaText: "Get Started",
        components: `
          <nav class="header-nav">
            <a href="#" class="header-logo">YourLogo</a>
            <ul class="header-menu">
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
            </ul>
            <button class="header-cta">Get Started</button>
          </nav>
        `,
      },
      init() {
        this.on("change:logo change:menuItems change:ctaText", this.updateContent);
      },
      updateContent() {
        const logo = this.get("logo");
        const menuItems = this.get("menuItems");
        const ctaText = this.get("ctaText");

        const items = menuItems.split(",").map((item: string) => item.trim());
        const menuItemsHtml = items.map((item: string) => `<li>${item}</li>`).join("");

        this.components(`
          <nav class="header-nav">
            <a href="#" class="header-logo">${logo}</a>
            <ul class="header-menu">
              ${menuItemsHtml}
            </ul>
            <button class="header-cta">${ctaText}</button>
          </nav>
        `);
      },
    },
  });
  
  editor.Blocks.add("header", {
    label: "Header",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160Zm0-80h640v-560H160v560Zm0 0v-560 560Z"/></svg>',
    content: {
      type: "header",
    },
  });
};

