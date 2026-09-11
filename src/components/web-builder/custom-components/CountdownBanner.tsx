import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const countdownBannerPlugin = (editor: Editor) => {
  editor.Components.addType("countdown-banner", {
    isComponent: (el: any) => el.classList?.contains("countdown-banner"),
    model: {
      defaults: {
        tagName: "section",
        attributes: { class: "countdown-banner" },
        styles: `
          .countdown-banner {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%);
            color: #fff;
            padding: 40px 32px;
            border-radius: 16px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            box-shadow: 0 8px 30px rgba(238, 82, 83, 0.35);
          }
          .countdown-banner-text {
            flex: 1;
            min-width: 220px;
          }
          .countdown-banner-headline {
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 8px;
          }
          .countdown-banner-subtext {
            font-size: 1rem;
            opacity: 0.92;
          }
          .countdown-banner-timer {
            display: inline-block;
            margin-top: 14px;
            padding: 8px 18px;
            font-size: 0.9rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50px;
          }
          .countdown-banner-button {
            padding: 14px 32px;
            font-size: 1.05rem;
            font-weight: 700;
            background: #fff;
            color: #ee5253;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            white-space: nowrap;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          }
          .countdown-banner-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          }
        `,
        traits: [
          {
            type: "text",
            name: "headline",
            label: "Headline",
            changeProp: true,
          },
          {
            type: "text",
            name: "subtext",
            label: "Subtext",
            changeProp: true,
          },
          {
            type: "text",
            name: "countdownText",
            label: "Countdown Text",
            changeProp: true,
          },
          {
            type: "text",
            name: "buttonText",
            label: "Button Text",
            changeProp: true,
          },
        ],
        headline: "Limited Time Offer",
        subtext: "Get 30% off all plans when you upgrade today.",
        countdownText: "Ends in 3 Days",
        buttonText: "Claim Offer",
        components: `
          <div class="countdown-banner-text">
            <h2 class="countdown-banner-headline">Limited Time Offer</h2>
            <p class="countdown-banner-subtext">Get 30% off all plans when you upgrade today.</p>
            <span class="countdown-banner-timer">⏱ Ends in 3 Days</span>
          </div>
          <button class="countdown-banner-button">Claim Offer</button>
        `,
      },
      init() {
        this.on("change:headline change:subtext change:countdownText change:buttonText", this.updateContent);
        if (!this.components().length) {
          this.updateContent();
        }
      },
      updateContent() {
        const headline = this.get("headline");
        const subtext = this.get("subtext");
        const countdownText = this.get("countdownText");
        const buttonText = this.get("buttonText");

        this.components(`
          <div class="countdown-banner-text">
            <h2 class="countdown-banner-headline">${headline}</h2>
            <p class="countdown-banner-subtext">${subtext}</p>
            <span class="countdown-banner-timer">⏱ ${countdownText}</span>
          </div>
          <button class="countdown-banner-button">${buttonText}</button>
        `);
      },
    },
  });

  editor.Blocks.add("countdown-banner", {
    label: "Countdown Banner",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#e8eaed" stroke-width="1.5"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 2h6M12 2v2" stroke-linecap="round"/></svg>',
    content: {
      type: "countdown-banner",
    },
  });
};
