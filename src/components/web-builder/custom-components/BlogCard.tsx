import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const blogCardPlugin = (editor: Editor) => {
  editor.Components.addType("blog-card", {
    isComponent: (el: any) => el.classList?.contains("blog-card"),
    model: {
      defaults: {
        tagName: "article",
        attributes: { class: "blog-card" },
        styles: `
          .blog-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }
          .blog-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
          }
          .blog-content {
            padding: 24px;
          }
          .blog-date {
            font-size: 0.9rem;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .blog-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 12px;
            color: #1a1a1a;
            line-height: 1.3;
          }
          .blog-excerpt {
            font-size: 1rem;
            line-height: 1.6;
            color: #666;
            margin-bottom: 20px;
          }
          .blog-read-more {
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: gap 0.3s;
          }
          .blog-read-more:hover {
            gap: 8px;
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
            name: "excerpt",
            label: "Excerpt",
            changeProp: true,
          },
          {
            type: "text",
            name: "date",
            label: "Date",
            changeProp: true,
          },
          {
            type: "text",
            name: "imageUrl",
            label: "Image URL",
            changeProp: true,
          },
        ],
        title: "Getting Started with Web Development",
        excerpt: "Learn the fundamentals of web development and build your first website with our comprehensive guide.",
        date: "Dec 15, 2024",
        imageUrl: "https://picsum.photos/seed/blog/800/400",
        components: `
          <img class="blog-image" src="https://picsum.photos/seed/blog/800/400" alt="Blog Post"/>
          <div class="blog-content">
            <div class="blog-date">Dec 15, 2024</div>
            <h2 class="blog-title">Getting Started with Web Development</h2>
            <p class="blog-excerpt">Learn the fundamentals of web development and build your first website with our comprehensive guide.</p>
            <a href="#" class="blog-read-more">Read More →</a>
          </div>
        `,
      },
      init() {
        this.on("change:title change:excerpt change:date change:imageUrl", this.updateContent);
      },
      updateContent() {
        const title = this.get("title");
        const excerpt = this.get("excerpt");
        const date = this.get("date");
        const imageUrl = this.get("imageUrl");

        this.components(`
          <img class="blog-image" src="${imageUrl}" alt="${title}"/>
          <div class="blog-content">
            <div class="blog-date">${date}</div>
            <h2 class="blog-title">${title}</h2>
            <p class="blog-excerpt">${excerpt}</p>
            <a href="#" class="blog-read-more">Read More →</a>
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("blog-card", {
    label: "Blog Card",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h400v-80H280v80Zm0-120h400v-80H280v80Zm0-120h280v-80H280v80Z"/></svg>',
    content: {
      type: "blog-card",
    },
  });
};

