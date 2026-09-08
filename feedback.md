**PRODUCT LAUNCH READINESS**

**Startup Ninja — Developer Launch Checklist**

P0 is the marketing launch gate. P1 follows immediately after.

Audience: Development & product team | Scope: Launch-critical readiness | Format: Testable checklist

> **How to use this:** Tick an item only when it works on a fresh test account, has clear loading/success/error states, and has a test link or short recording attached.
>
> **Priority:** P0 = must be fixed before marketing. P1 = complete immediately after P0. Do not spend launch week on unrelated features.

# **1. P0 — Product Stability and Trust**

- Fix all broken buttons, links, forms, API calls and unfinished interactions.

- Use one consistent visual system across the whole app: font, spacing, buttons, cards, icons, menus and page layout.

- Make desktop, tablet and mobile layouts work properly.

- Add useful loading, empty, success and error states; no screen may stay on “Loading…” permanently.

- Add clear notifications/toasts after every create, edit, publish, save, delete, upgrade or failed action.

- Add confirmation dialogs before destructive actions.

- Remove placeholder, demo-looking, AI-looking and broken UI/copy.

- Fix login, signup, forgot-password and reset-password flows.

- Fix profile retrieval. Settings and Team Management must never show “Failed to fetch profile” or crash.

- Fix session persistence. Users are currently logged out after roughly 10–15 minutes.

- Refresh valid sessions silently, preserve unsaved drafts, and show a clear “session expired” message only after genuine expiry

- Fix dashboard data: usage limits, reset times, dates, pipeline totals and activity must be correct.

- Remove every “Invalid Date” record from the product UI.

- Reconcile all dashboard metrics with the data shown inside each module.

# **2. P0 — Pricing, Plans and Feature Gates**

## **Final plan structure**

| **Plan**       | **Monthly price** | **Intended customer**            | **Suggested starting access**                                                               |
|------------------------------------------|---------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| **Go**         | **$15**          | Individual founder or basic user | 1 active hosted website, Chat, Image Generation, 1 user                                     |
| **Go Student** | **$10**          | Verified student                 | Same limits as Go; $5 student discount after Student ID verification                       |
| **Pro**        | **$39**          | Growing business                 | More AI usage, up to 3 active websites, Social Pro, Ninja Sales/Legal, up to 2 users        |
| **Business**   | **$99**          | Team or serious business         | Higher AI usage, up to 10 active websites, more social accounts, Sales/Legal, up to 5 users |
| **Custom**                               | Custom quote                                | Larger teams / special requirements                        | Custom limits, seats, support and integrations                                                                        |

## **Suggested monthly AI limits — validate against real usage cost before publishing**

| **Plan**        | **Chat messages**       | **Image credits**       | **File uploads**        | **Website limit**         |
|-----------------|-------------------------|-------------------------|-------------------------|---------------------------|
| Go / Go Student | 250                     | 40                      | 10                      | 1 active hosted website   |
| Pro             | 1,000                   | 200                     | 100                     | 3 active hosted websites  |
| Business        | 4,000                   | 800                     | 500                     | 10 active hosted websites |
| Custom          | Configured per contract | Configured per contract | Configured per contract | Configured per contract   |

- Use **Go**, **Pro**, **Business** and **Custom** consistently in the app, database, checkout, emails and public website.

- Remove or map the old Founder/Growth/Free pricing labels; do not show conflicting plan names or prices.

- Define “one website” clearly as one active published/hosted site. Domain purchase is separate; users may connect a domain they already own.

- Add a Go Student plan at **$10/month** after verification of a current Student ID.

- Restrict the student price to the Go-level plan only; re-verify eligibility periodically and do not retain ID images longer than necessary.

- Implement plans and quotas server-side, not only in the frontend.

- Show users their current plan, usage, remaining credits and exact reset date/time.

- Fix incorrect usage counters and reset calculations before launch.

- Block access cleanly when a user reaches a plan limit; show upgrade options instead of broken actions.

- Complete upgrade, downgrade, cancellation, billing history, payment-status and failed-payment flows.

- Test renewal, failed payment, upgrade, downgrade, cancellation and reactivation edge cases.

# **3. P0 — Ninja Chat**

- Add web search in chat.

- Show source citations whenever web search is used.

- Let users open/view the cited sources.

- Add a visible attachment button and drag-and-drop file area beside the prompt.

- Support PDF, DOCX, XLSX/CSV, PPTX, TXT, JPG, JPEG and PNG uploads.

- Allow multiple files in a single conversation.

- Store files securely by user/workspace and validate file type/size on the server.

- Let users ask questions and request summaries using attached documents.

- Cite the uploaded filename and page/section where available.

- Show upload progress, document-processing status and useful errors.

- Let users remove an attachment before sending and delete stored/chat files afterward.

- Make upload count, size and processing quota configurable by plan.

- Add a fixed search bar at the top of Chat History.

- Search conversation titles, prompts and response text; show a matching snippet/date and open the result directly.

- Do not make users scroll manually through chat history to find old conversations.

- Add New Chat, Edit Prompt, Regenerate, Copy Response and Stop Generation actions.

- Add suggested follow-up prompts.

- Improve markdown, tables and code-block rendering.

- Improve response speed, reliability and failed-generation handling.

- Add business/user memory with a page to view, edit and delete saved memories.

# **4. P0 — Website Builder: Beginner-First Flow**

- Replace the current complex “Project Name + Description + long template grid” first screen.

- Remove duplicate/confusing first actions such as “Start New Website” and “Create a Project” appearing together.

- Use **website** and **business** language for beginners; hide “project” terminology from the main creation path.

- Create a three-step wizard:

  - **Step 1: Tell Ninja about your business** — business name and one-line description required; industry, goal, logo and brand colours optional.

  - Reuse onboarding/brand data automatically so the user does not repeat information.

  - **Step 2: Choose a vibe** — Modern, Minimal, Bold, Elegant, Local Business, Portfolio, plus “Let Ninja choose for me.”

  - Show compact visual style cards only; move full website previews into a modal/preview screen.

  - **Step 3: Review and publish** — show a generated draft with only Keep This, Change Style, Tell Ninja What to Change, Preview, Edit and Publish.

- Let a complete beginner create a credible first website draft in under three minutes.

- Make the normal editor contain only **Content, Design, Pages and Settings**.

- Add an always-visible “Ask Ninja” control for plain-English changes.

- Hide CSS/HTML, detailed animation settings and other expert options inside **Advanced**.

- Auto-save, show saved state, provide undo and maintain version history.

- Fix Recent Websites loading; show a clean list with Edit, Preview and Publish only.

- Add 20–30 polished templates across SaaS, agency, restaurant/coffee, real estate, e-commerce, portfolio, personal brand, consulting, construction, law, gym, beauty, automotive, hotel, startup and local business.

- Let users add, duplicate, delete and reorder sections.

- Add AI Rewrite Section, AI Redesign Section and AI Regenerate Image.

- Add desktop/tablet/mobile preview and responsive editing.

- Add favicon, SEO title, meta description, Open Graph image, contact forms, social links, preview URL and custom 404 page.

# **5. P0 — Publishing and Domains**

- Make the journey clear: **Create → Preview → Connect Domain → Publish → Live**.

- Let users connect a domain they already own.

- Add GoDaddy and Namecheap integrations where API access permits.

- Automate DNS where possible; otherwise provide a simple guided DNS setup.

- Provision SSL automatically.

- Show domain connection, SSL and publishing status clearly.

- Show actionable publishing errors, not generic failures.

- Do not market “publish in minutes” until this whole path works for a non-technical user.

# **6. P0 — Ninja Sales Data Integrity**

- Use one canonical deal/project data source for Projects, Pipeline, Lead Detail, Dashboard and Follow-ups.

- Fix the Projects Pipeline board: it currently shows $0 and no deals even when projects exist.

- Render every existing deal in the correct Pipeline column.

- Use the core stages: **New → Contacted → Qualified → Proposal → Negotiation → Won/Lost**.

- Keep Hold only as an optional non-primary status.

- Add drag-and-drop stage changes inside Pipeline.

- Add a stage dropdown on each pipeline card.

- Persist stage changes, refresh metrics instantly and show a success/error toast.

- Keep Edit Project stage editing working and make it update Pipeline immediately.

- Split the confusing “Create Lead & Project” flow into **Create Lead** and **Create Deal for Existing Lead**.

- After create/update, show the new record immediately; do not show misleading $0/empty/loading states for several seconds.

- Add Delete controls for leads and projects on list, detail and edit screens.

- Limit deletion to owners/admins and use a clear confirmation dialog.

- Explain what happens to linked deals, tasks, follow-ups and documents when deleting a lead.

- Prefer a recoverable soft-delete/restore period.

- Fix data relationships: never show another customer’s proposal/invoice history on an unrelated lead/project.

- Add clear, usable empty states for leads, projects, follow-ups and AI suggestions.

- Add lead fields: name, company, email, phone, source, value, stage, notes, last contact and next action.

- Add AI lead score (Hot/Warm/Cold) with a reason for the score.

- Add AI follow-up generation, reminders and “Who should I contact today?”

# **7. P1 — Social Pro**

- Do not claim Instagram/Facebook publishing until the integrations work end-to-end.

- Restore/fix Instagram and Facebook connections.

- Enable account connection; do not leave enabled-looking but disabled Connect buttons.

- Add post creation, captions, hashtags, carousel content, Reel/video concepts and content calendar.

- Support video media before marketing Reel/video workflow.

- Add scheduling/publishing only where each platform API permits it.

- Add analytics and a visual content calendar.

- Add content repurposing: one input → Instagram, Facebook, Reel script, LinkedIn post, blog/article and short-form content.

- Apply each customer’s saved brand voice across generated content.

# **8. P1 — Imaginative Ninja / Image Generation**

- Correct the product name “Imagenative Ninja” and use one final name everywhere.

- Improve image quality and text rendering.

- Add image presets: Instagram Post, Story, Poster, Advertisement, Website Hero, Product Image, YouTube Thumbnail and Social Graphic.

- Add multiple aspect ratios.

- Save brand assets: logo, colours, fonts, product images and visual style.

- Add iterative editing: change text, remove/add object, background, colours, logo, product/clothing or layout.

- Add Continue Editing, Create Variation, Compare Versions, version history, gallery and download/export.

# **9. P1 — Ninja Legal**

- Fix the empty/broken Contract Generation page before putting it in navigation.

- Correct the irrelevant “Workforce Manager” copy on the Legal module.

- Position it as legal assistance, not a replacement for a lawyer.

- Add clear disclaimer and professional-review recommendation.

- Generate NDA, service, freelancer, employment, contractor, partnership, consulting, terms, privacy and refund documents.

- Add contract upload, summary, obligations, payment terms, termination clauses, risky clauses and plain-English explanation.

- Add contract comparison and document export.

# **10. P1 — Onboarding, Settings, Analytics and Admin**

- Onboarding must collect business name, industry, description, target customer, website, social accounts, products/services, brand tone and goals.

- Use onboarding data throughout Chat, Website Builder, Social Pro and Image Generation.

- Make Settings work: profile, business info, password/security, billing, usage, connected accounts/domains, memory, export and account deletion.

- Store real IANA timezones (for example, \`America/Los_Angeles\`), not abbreviations such as PST.

- Make Team Management show members, roles, invitations, permissions and a useful empty state.

- Track signups, activated users, DAU/MAU, feature usage, retention, churn, paid users, trial-to-paid conversion, MRR, ARR, ARPU, refunds and adoption.

- Build Admin dashboard for total/active/paid users, revenue, MRR, signups, usage, activity, subscriptions, errors, support and account management.

# **11. Security and Public Pages**

- Set up automated database backups and error monitoring.

- Use secure API-key management; never expose secrets in frontend or public APIs.

- Add rate limiting, authentication/authorization and secure file uploads.

- Test account/data deletion and protect user/business data.

- Add Terms & Conditions, Privacy Policy, Refund Policy, cookie consent where required, Contact/Support, Pricing, FAQ, About and full footer links.

# **12. Final Release QA**

- Test with a fresh user account and an existing account.

- Test Chrome, Safari and Edge on desktop, tablet and mobile.

- Test signup/login, session refresh/logout, password reset and Settings.

- Test payments, plan gates, usage reset, upgrade/downgrade/cancellation and failed payments.

- Test Chat, web search, citations, chat-history search, file upload and file deletion.

- Test website creation, editing, preview, domain connection and publishing.

- Test social connections, scheduling and publishing.

- Test image generation, editing and export.

- Test Sales lead/deal creation, edit, drag/drop stage change, delete/restore and data consistency.

- Test Legal generation, upload, analysis and export.

- Test account deletion and data deletion.

- Confirm no P0 items are open before launch marketing.

# **Final Launch Positioning Check**

- Do not market Startup Ninja as a direct ChatGPT/Claude competitor before Chat, sources, documents, reliability and quality are genuinely comparable.

- Position it as an **AI workspace for founders and small businesses**: create content, visuals, websites, sales workflows and business documents in one place.

- Remove or mark as Coming Soon every public feature claim that does not currently work.

- Verify or remove any unproven social-proof numbers before publishing them.