import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const alertBannerPlugin = (editor: Editor) => {
  editor.Components.addType("alert-banner", {
    isComponent: (el: any) => el.classList?.contains("alert-banner"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "alert-banner" },
        styles: `
          .alert-banner {
            padding: 20px 30px;
            border-radius: 12px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .alert-banner.info {
            background: #e3f2fd;
            color: #1976d2;
            border-left: 4px solid #1976d2;
          }
          .alert-banner.success {
            background: #e8f5e9;
            color: #2e7d32;
            border-left: 4px solid #2e7d32;
          }
          .alert-banner.warning {
            background: #fff3e0;
            color: #f57c00;
            border-left: 4px solid #f57c00;
          }
          .alert-banner.error {
            background: #ffebee;
            color: #c62828;
            border-left: 4px solid #c62828;
          }
          .alert-icon {
            font-size: 1.5rem;
            font-weight: bold;
          }
          .alert-text {
            font-size: 1rem;
            line-height: 1.6;
            flex: 1;
          }
        `,
        traits: [
          {
            type: "select",
            name: "type",
            label: "Alert Type",
            options: [
              { id: "info", label: "Info" },
              { id: "success", label: "Success" },
              { id: "warning", label: "Warning" },
              { id: "error", label: "Error" },
            ],
            changeProp: true,
          },
          {
            type: "textarea",
            name: "message",
            label: "Message",
            changeProp: true,
          },
        ],
        type: "info",
        message: "This is an informational message for your users.",
      },
      init() {
        this.on("change:type change:message", this.updateContent);
      },
      updateContent() {
        const type = this.get("type");
        const message = this.get("message");
        
        const icons = {
          info: "ℹ️",
          success: "✓",
          warning: "⚠️",
          error: "✕"
        };

        this.addAttributes({ class: `alert-banner ${type}` });
        
        const icon = icons[type as keyof typeof icons] || "ℹ️";

        this.components(`
          <span class="alert-icon">${icon}</span>
          <div class="alert-text">${message}</div>
        `);
      },
    },
  });
  
  editor.Blocks.add("alert-banner", {
    label: "Alert Banner",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#e8eaed"><path d="M12 2L1 21h22L12 2z" fill="none" stroke="#e8eaed" stroke-width="1.5"/><path d="M12 8v6" stroke="#e8eaed" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="#e8eaed"/></svg>',
    content: {
      type: "alert-banner",
      attributes: { class: "alert-banner info" },
    },
  });
};

