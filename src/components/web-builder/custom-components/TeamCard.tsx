import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";

export const teamCardPlugin = (editor: Editor) => {
  editor.Components.addType("team-card", {
    isComponent: (el: any) => el.classList?.contains("team-card"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "team-card" },
        styles: `
          .team-card {
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s, box-shadow 0.3s;
            text-align: center;
          }
          .team-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }
          .team-avatar {
            width: 100%;
            height: 300px;
            object-fit: cover;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .team-info {
            padding: 30px 20px;
          }
          .team-name {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 8px;
            color: #1a1a1a;
          }
          .team-role {
            font-size: 1rem;
            color: #667eea;
            margin-bottom: 12px;
            font-weight: 600;
          }
          .team-bio {
            font-size: 0.95rem;
            color: #666;
            line-height: 1.6;
          }
        `,
        traits: [
          {
            type: "text",
            name: "name",
            label: "Name",
            changeProp: true,
          },
          {
            type: "text",
            name: "role",
            label: "Role",
            changeProp: true,
          },
          {
            type: "textarea",
            name: "bio",
            label: "Bio",
            changeProp: true,
          },
          {
            type: "text",
            name: "avatar",
            label: "Avatar URL",
            changeProp: true,
          },
        ],
        name: "John Doe",
        role: "CEO & Founder",
        bio: "Passionate about building innovative solutions that make a difference.",
        avatar: "https://picsum.photos/seed/team/400/400",
        components: `
          <img class="team-avatar" src="https://picsum.photos/seed/team/400/400" alt="John Doe"/>
          <div class="team-info">
            <h3 class="team-name">John Doe</h3>
            <p class="team-role">CEO & Founder</p>
            <p class="team-bio">Passionate about building innovative solutions that make a difference.</p>
          </div>
        `,
      },
      init() {
        this.on("change:name change:role change:bio change:avatar", this.updateContent);
      },
      updateContent() {
        const name = this.get("name");
        const role = this.get("role");
        const bio = this.get("bio");
        const avatar = this.get("avatar");

        this.components(`
          <img class="team-avatar" src="${avatar}" alt="${name}"/>
          <div class="team-info">
            <h3 class="team-name">${name}</h3>
            <p class="team-role">${role}</p>
            <p class="team-bio">${bio}</p>
          </div>
        `);
      },
    },
  });
  
  editor.Blocks.add("team-card", {
    label: "Team Card",
    category: "Custom",
    media: '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.921 44.694q31.301 14.126 50.19 40.966Q800-292 800-256v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-630q0-39-25.5-64.5T480-720q-39 0-64.5 25.5T390-630q0 39 25.5 64.5T480-540Zm0-90Zm0 411Z"/></svg>',
    content: {
      type: "team-card",
    },
  });
};

