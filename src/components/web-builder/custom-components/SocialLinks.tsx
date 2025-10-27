import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const socialLinksPlugin = (editor: Editor) => {
  editor.Components.addType("social-links", {
    isComponent: (el: any) => el.classList?.contains("social-links"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "social-links" },
        styles: `
          .social-links {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .social-link {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .social-link:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
          }
          .social-link.facebook { background: linear-gradient(135deg, #4267B2 0%, #365899 100%); }
          .social-link.twitter { background: linear-gradient(135deg, #1DA1F2 0%, #14171a 100%); }
          .social-link.linkedin { background: linear-gradient(135deg, #0077b5 0%, #005885 100%); }
          .social-link.instagram { background: linear-gradient(135deg, #E4405F 0%, #C13584 100%); }
        `,
        components: `
          <a href="#" class="social-link facebook">f</a>
          <a href="#" class="social-link twitter">t</a>
          <a href="#" class="social-link linkedin">in</a>
          <a href="#" class="social-link instagram">ig</a>
        `,
      },
    },
  });
  
  editor.Blocks.add("social-links", {
    label: "Social Links",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-142 0-241 99t-99 241q0 141 99 240.5T480-140Zm0-340Z"/></svg>',
    content: {
      type: "social-links",
    },
  });
};

