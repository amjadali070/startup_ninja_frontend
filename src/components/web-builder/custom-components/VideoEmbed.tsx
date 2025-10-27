import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const videoEmbedPlugin = (editor: Editor) => {
  editor.Components.addType("video-embed", {
    isComponent: (el: any) => el.classList?.contains("video-embed"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "video-embed" },
        styles: `
          .video-embed {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            border-radius: 16px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          }
          .video-embed iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
        `,
        traits: [
          {
            type: "text",
            name: "videoUrl",
            label: "Video URL (YouTube/Vimeo)",
            changeProp: true,
          },
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        components: `
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `,
      },
      init() {
        this.on("change:videoUrl", this.updateContent);
      },
      updateContent() {
        const videoUrl = this.get("videoUrl");

        this.components(`
          <iframe 
            src="${videoUrl}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `);
      },
    },
  });
  
  editor.Blocks.add("video-embed", {
    label: "Video Embed",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M320-200v-560l440 280-440 280Zm80-280 280-180v360L400-480Zm0 0v-180 360 360Z"/></svg>',
    content: {
      type: "video-embed",
    },
  });
};

