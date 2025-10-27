import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const faqItemPlugin = (editor: Editor) => {
  editor.Components.addType("faq-item", {
    isComponent: (el: any) => el.classList?.contains("faq-item"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "faq-item" },
        styles: `
          .faq-item {
            background: #fff;
            border-radius: 12px;
            margin-bottom: 16px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: box-shadow 0.3s;
          }
          .faq-item:hover {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .faq-question {
            padding: 24px;
            font-size: 1.2rem;
            font-weight: 700;
            color: #1a1a1a;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .faq-icon {
            font-size: 1.5rem;
            color: #667eea;
            transition: transform 0.3s;
          }
          .faq-item.active .faq-icon {
            transform: rotate(180deg);
          }
          .faq-answer {
            padding: 0 24px 24px 24px;
            font-size: 1rem;
            line-height: 1.7;
            color: #666;
          }
        `,
        traits: [
          {
            type: "text",
            name: "question",
            label: "Question",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "answer",
            label: "Answer",
            changeProp: true,
          },
        ],
        question: "How can I get started?",
        answer: "You can get started by signing up for an account and exploring our features. We offer a free trial to get you started.",
        components: `
          <div class="faq-question">
            <span>How can I get started?</span>
            <span class="faq-icon">▼</span>
          </div>
          <div class="faq-answer">
            You can get started by signing up for an account and exploring our features. We offer a free trial to get you started.
          </div>
        `,
      },
      init() {
        this.on("change:question change:answer", this.updateContent);
      },
      updateContent() {
        const question = this.get("question");
        const answer = this.get("answer");

        this.components(`
          <div class="faq-question">
            <span>${question}</span>
            <span class="faq-icon">▼</span>
          </div>
          <div class="faq-answer">
            ${answer}
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("faq-item", {
    label: "FAQ Item",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-80q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560v80q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
    content: {
      type: "faq-item",
    },
  });
};

