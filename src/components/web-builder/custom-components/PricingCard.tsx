import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const pricingCardPlugin = (editor: Editor) => {
  editor.Components.addType("pricing-card", {
    isComponent: (el: any) => el.classList?.contains("pricing-card"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "pricing-card" },
        styles: `
          .pricing-card {
            padding: 40px 30px;
            border-radius: 24px;
            background: #fff;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s, box-shadow 0.3s;
            border: 2px solid #f0f0f0;
          }
          .pricing-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }
          .pricing-card-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 2px solid #f0f0f0;
          }
          .pricing-plan {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: #1a1a1a;
          }
          .pricing-price {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            gap: 4px;
          }
          .pricing-amount {
            font-size: 3rem;
            font-weight: 800;
            color: #667eea;
          }
          .pricing-period {
            font-size: 1.1rem;
            color: #999;
            margin-top: 10px;
          }
          .pricing-features {
            margin-bottom: 30px;
          }
          .pricing-features p {
            padding: 12px 0;
            color: #666;
            border-bottom: 1px solid #f5f5f5;
          }
          .pricing-features p:first-child {
            padding-top: 0;
          }
          .pricing-features p:last-child {
            border-bottom: none;
          }
          .pricing-button {
            width: 100%;
            padding: 14px;
            font-size: 1.1rem;
            font-weight: 600;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .pricing-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
          .pricing-card.popular {
            border: 2px solid #667eea;
            background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
          }
        `,
        traits: [
          {
            type: "text",
            name: "plan",
            label: "Plan Name",
            changeProp: true,
          },
          {
            type: "text",
            name: "price",
            label: "Price",
            changeProp: true,
          },
          {
            type: "text",
            name: "period",
            label: "Period",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "features",
            label: "Features (one per line)",
            changeProp: true,
          },
          {
            type: "text",
            name: "buttonText",
            label: "Button Text",
            changeProp: true,
          },
          {
            type: "checkbox",
            name: "popular",
            label: "Popular Badge",
            changeProp: true,
          },
        ],
        plan: "Basic Plan",
        price: "$19",
        period: "/month",
        features: "10,000 Monthly Requests\n24/7 Support\nAdvanced Analytics\nAPI Access",
        buttonText: "Get Started",
        popular: false,
        components: `
          <div class="pricing-card-header">
            <h3 class="pricing-plan">Basic Plan</h3>
            <div class="pricing-price">
              <span class="pricing-amount">$19</span>
              <span class="pricing-period">/month</span>
            </div>
          </div>
          <div class="pricing-features">
            <p>10,000 Monthly Requests</p>
            <p>24/7 Support</p>
            <p>Advanced Analytics</p>
            <p>API Access</p>
          </div>
          <button class="pricing-button">Get Started</button>
        `,
      },
      init() {
        this.on("change:plan change:price change:period change:features change:buttonText change:popular", this.updateContent);
      },
      updateContent() {
        const plan = this.get("plan");
        const price = this.get("price");
        const period = this.get("period");
        const features = this.get("features");
        const buttonText = this.get("buttonText");
        const popular = this.get("popular");

        const featuresList = features.split('\n').map((f: string) => `<p>${f}</p>`).join('');
        const popularClass = popular ? 'popular' : '';

        this.components(`
          <div class="pricing-card-header ${popularClass}">
            <h3 class="pricing-plan">${plan}</h3>
            <div class="pricing-price">
              <span class="pricing-amount">${price}</span>
              <span class="pricing-period">${period}</span>
            </div>
          </div>
          <div class="pricing-features">
            ${featuresList}
          </div>
          <button class="pricing-button">${buttonText}</button>
        `);
      },
    },
  });
  
  editor.Blocks.add("pricing-card", {
    label: "Pricing Card",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M240-160q-50 0-85-35t-35-85v-130h-60v-270h720v270h-60v130q0 50-35 85t-85 35H240Zm0-60h480v-200h-160v-200H240v200H80v70h160v130Zm200-320v200H240v200h320v-200H400Z"/></svg>',
    content: {
      type: "pricing-card",
    },
  });
};

