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
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><path d="M4 4h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-5 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8 9h8M8 12h5" stroke="#0b0b0b" stroke-width="0"/></svg>',
    content: {
      type: "faq-item",
    },
  });
};

