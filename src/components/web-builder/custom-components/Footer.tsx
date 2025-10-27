import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const footerPlugin = (editor: Editor) => {
  editor.Components.addType("footer", {
    isComponent: (el: any) => el.classList?.contains("footer"),
    model: {
      defaults: {
        tagName: "footer",
        attributes: { class: "footer" },
        styles: `
          .footer {
            background: #1a1a1a;
            color: #fff;
            padding: 60px 40px 30px;
          }
          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
          }
          .footer-column h3 {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: #fff;
          }
          .footer-column p,
          .footer-column a {
            font-size: 0.95rem;
            line-height: 1.8;
            color: #ccc;
            text-decoration: none;
            display: block;
            margin-bottom: 10px;
            transition: color 0.3s;
          }
          .footer-column a:hover {
            color: #667eea;
          }
          .footer-bottom {
            max-width: 1200px;
            margin: 0 auto;
            padding-top: 30px;
            border-top: 1px solid #333;
            text-align: center;
            font-size: 0.9rem;
            color: #999;
          }
        `,
        traits: [
          {
            type: "textarea",
            name: "companyInfo",
            label: "Company Info",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "links",
            label: "Quick Links (one per line)",
            changeProp: true,
          },
          {
            type: "text",
            name: "copyright",
            label: "Copyright Text",
            changeProp: true,
          },
        ],
        companyInfo: "Your Company Name\nAddress Line 1\nCity, Country",
        links: "Home\nAbout\nServices\nContact",
        copyright: "© 2024 Your Company. All rights reserved.",
        components: `
          <div class="footer-content">
            <div class="footer-column">
              <h3>Company</h3>
              <p>Your Company Name</p>
              <p>Address Line 1</p>
              <p>City, Country</p>
            </div>
            <div class="footer-column">
              <h3>Quick Links</h3>
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Services</a>
              <a href="#">Contact</a>
            </div>
            <div class="footer-column">
              <h3>Connect</h3>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© 2024 Your Company. All rights reserved.</p>
          </div>
        `,
      },
      init() {
        this.on("change:companyInfo change:links change:copyright", this.updateContent);
      },
      updateContent() {
        const companyInfo = this.get("companyInfo");
        const links = this.get("links");
        const copyright = this.get("copyright");

        const infoLines = companyInfo.split("\n").map((line: string) => `<p>${line}</p>`).join("");
        const linkLines = links.split("\n").map((line: string) => `<a href="#">${line}</a>`).join("");

        this.components(`
          <div class="footer-content">
            <div class="footer-column">
              <h3>Company</h3>
              ${infoLines}
            </div>
            <div class="footer-column">
              <h3>Quick Links</h3>
              ${linkLines}
            </div>
            <div class="footer-column">
              <h3>Connect</h3>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>${copyright}</p>
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("footer", {
    label: "Footer",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z"/></svg>',
    content: {
      type: "footer",
    },
  });
};

