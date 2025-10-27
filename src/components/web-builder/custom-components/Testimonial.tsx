import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const testimonialPlugin = (editor: Editor) => {
  editor.Components.addType("testimonial", {
    isComponent: (el: any) => el.classList?.contains("testimonial"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "testimonial" },
        styles: `
          .testimonial {
            padding: 40px;
            border-radius: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
          }
          .testimonial-quote {
            font-size: 1.25rem;
            line-height: 1.8;
            margin-bottom: 30px;
            font-style: italic;
            position: relative;
            padding-left: 60px;
          }
          .testimonial-quote::before {
            content: '"';
            position: absolute;
            left: 0;
            top: -20px;
            font-size: 5rem;
            opacity: 0.3;
            font-family: Georgia, serif;
          }
          .testimonial-author {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .testimonial-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 3px solid rgba(255, 255, 255, 0.3);
            object-fit: cover;
          }
          .testimonial-name {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 4px;
          }
          .testimonial-role {
            font-size: 0.95rem;
            opacity: 0.9;
          }
        `,
        traits: [
          {
            type: "textarea",
            name: "quote",
            label: "Quote",
            changeProp: true,
          },
          {
            type: "text",
            name: "author",
            label: "Author Name",
            changeProp: true,
          },
          {
            type: "text",
            name: "role",
            label: "Role",
            changeProp: true,
          },
          {
            type: "text",
            name: "avatar",
            label: "Avatar URL",
            changeProp: true,
          },
        ],
        quote: "This product has transformed the way we work. The ease of use and powerful features make it an essential tool for our team.",
        author: "Sarah Johnson",
        role: "CEO, Tech Innovations",
        avatar: "https://picsum.photos/seed/avatar/100/100",
        components: `
          <p class="testimonial-quote">This product has transformed the way we work. The ease of use and powerful features make it an essential tool for our team.</p>
          <div class="testimonial-author">
            <img class="testimonial-avatar" src="https://picsum.photos/seed/avatar/100/100" alt="Sarah Johnson"/>
            <div>
              <h4 class="testimonial-name">Sarah Johnson</h4>
              <p class="testimonial-role">CEO, Tech Innovations</p>
            </div>
          </div>
        `,
      },
      init() {
        this.on("change:quote change:author change:role change:avatar", this.updateContent);
      },
      updateContent() {
        const quote = this.get("quote");
        const author = this.get("author");
        const role = this.get("role");
        const avatar = this.get("avatar");

        this.components(`
          <p class="testimonial-quote">${quote}</p>
          <div class="testimonial-author">
            <img class="testimonial-avatar" src="${avatar}" alt="${author}"/>
            <div>
              <h4 class="testimonial-name">${author}</h4>
              <p class="testimonial-role">${role}</p>
            </div>
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("testimonial", {
    label: "Testimonial",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-839 325-870.5T480-902q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-98.5Q820-337 820-480q0-143-99-241.5Q622-820 480-820q-142 0-240.5 98.5Q141-623 141-480q0 142 98.5 240.5Q338-141 480-141Zm-40-133h82v-82h-82v82Zm1-200h80l4-160q-27 5-48.5 15.5T450-518q-8 12-11.5 26t-3.5 30q0 33 23.5 56.5T516-382q26 0 47.5-18.5T583-454q4-29 16-55.5t26-48.5q16-24 16-69h-96v240Zm-1-80Z"/></svg>',
    content: {
      type: "testimonial",
    },
  });
};

