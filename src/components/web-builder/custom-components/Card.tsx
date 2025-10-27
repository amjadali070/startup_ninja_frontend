import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const cardPlugin = (editor: Editor) => {
  editor.Components.addType("card", {
    isComponent: (el: any) => el.classList?.contains("card"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "card" },
        styles: `
          .card {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s, box-shadow 0.3s;
            background: #fff;
          }
          .card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }
          .card-image {
            width: 100%;
            height: 240px;
            overflow: hidden;
            background: #f0f0f0;
          }
          .card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
          }
          .card:hover .card-image img {
            transform: scale(1.1);
          }
          .card-content {
            padding: 24px;
          }
          .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 12px;
            color: #1a1a1a;
          }
          .card-text {
            font-size: 1rem;
            line-height: 1.6;
            color: #666;
          }
        `,
        traits: [
          {
            type: "text",
            name: "title",
            label: "Card Title",
            changeProp: true,
          },
          {
            type: "text",
            name: "imageUrl",
            label: "Image URL",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "content",
            label: "Card Content",
            changeProp: true,
          },
        ],
        title: "Card Title",
        imageUrl: "https://picsum.photos/seed/card/400/300",
        content: "Add your content here. This is a beautiful card component with hover effects and smooth transitions.",
        components: `
          <div class="card-image">
            <img src="https://picsum.photos/seed/card/400/300" alt="Card Title"/>
          </div>
          <div class="card-content">
            <h3 class="card-title">Card Title</h3>
            <p class="card-text">Add your content here. This is a beautiful card component with hover effects and smooth transitions.</p>
          </div>
        `,
      },
      init() {
        this.on("change:title change:imageUrl change:content", this.updateContent);
      },
      updateContent() {
        const title = this.get("title");
        const imageUrl = this.get("imageUrl");
        const content = this.get("content");

        this.components(`
          <div class="card-image">
            <img src="${imageUrl}" alt="${title}"/>
          </div>
          <div class="card-content">
            <h3 class="card-title">${title}</h3>
            <p class="card-text">${content}</p>
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("card", {
    label: "Card",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M560-440h200v-80H560v80Zm0-120h200v-80H560v80ZM200-320h320v-22q0-45-44-71.5T360-440q-72 0-116 26.5T200-342v22Zm160-160q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>',
    content: {
      type: "card",
    },
  });
};

