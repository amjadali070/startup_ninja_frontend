import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const imageGalleryPlugin = (editor: Editor) => {
  editor.Components.addType("image-gallery", {
    isComponent: (el: any) => el.classList?.contains("image-gallery"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "image-gallery" },
        styles: `
          .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            padding: 0;
          }
          .gallery-grid img {
            width: 100%;
            height: 280px;
            object-fit: cover;
            border-radius: 16px;
            transition: transform 0.4s, filter 0.4s;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .gallery-grid img:hover {
            transform: scale(1.05) rotate(2deg);
            filter: brightness(1.1);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          }
          @media (max-width: 768px) {
            .image-gallery {
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 16px;
            }
            .gallery-grid img {
              height: 200px;
            }
          }
        `,
        traits: [
          {
            type: "text",
            name: "image1",
            label: "Image 1 URL",
            changeProp: true,
          },
          {
            type: "text",
            name: "image2",
            label: "Image 2 URL",
            changeProp: true,
          },
          {
            type: "text",
            name: "image3",
            label: "Image 3 URL",
            changeProp: true,
          },
          {
            type: "text",
            name: "image4",
            label: "Image 4 URL",
            changeProp: true,
          },
        ],
        image1: "https://picsum.photos/seed/gal1/400/400",
        image2: "https://picsum.photos/seed/gal2/400/400",
        image3: "https://picsum.photos/seed/gal3/400/400",
        image4: "https://picsum.photos/seed/gal4/400/400",
        components: `
          <div class="gallery-grid">
            <img src="https://picsum.photos/seed/gal1/400/400" alt="Gallery Image 1" loading="lazy"/>
            <img src="https://picsum.photos/seed/gal2/400/400" alt="Gallery Image 2" loading="lazy"/>
            <img src="https://picsum.photos/seed/gal3/400/400" alt="Gallery Image 3" loading="lazy"/>
            <img src="https://picsum.photos/seed/gal4/400/400" alt="Gallery Image 4" loading="lazy"/>
          </div>
        `,
      },
      init() {
        this.on("change:image1 change:image2 change:image3 change:image4", this.updateContent);
      },
      updateContent() {
        const image1 = this.get("image1");
        const image2 = this.get("image2");
        const image3 = this.get("image3");
        const image4 = this.get("image4");

        this.components(`
          <div class="gallery-grid">
            <img src="${image1}" alt="Gallery Image 1" loading="lazy"/>
            <img src="${image2}" alt="Gallery Image 2" loading="lazy"/>
            <img src="${image3}" alt="Gallery Image 3" loading="lazy"/>
            <img src="${image4}" alt="Gallery Image 4" loading="lazy"/>
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("image-gallery", {
    label: "Image Gallery",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
    content: {
      type: "image-gallery",
    },
  });
};

