export interface NewsArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  body: string[];
  readTime: string;
}

// Every article here describes something genuinely built in the product.
// No invented metrics, no fabricated partnerships, no customer stories that
// never happened. Ordered oldest to newest; components that need "latest
// first" reverse it themselves.
export const newsArticles: NewsArticle[] = [
  {
    slug: "introducing-startup-ninja",
    title:
      "Startup Ninja: One Workspace for Chat, Design, Your Site, Social, Sales, and Contracts",
    category: "Product",
    date: "June 2026",
    image: "/images/dashboard-banner.png",
    excerpt:
      "Startup Ninja brings six tools founders normally pay for separately into one place: Ninja Chat, Imaginative Ninja for image generation, Web Builder, Social Pro, Ninja Sales, and Ninja Legal.",
    body: [
      "Most early-stage founders end up with the same stack: a chat assistant for drafting and research, an image tool for visuals, a website builder, a social scheduler, a spreadsheet standing in for a CRM, and a lawyer's inbox for every contract question. Startup Ninja puts all six of those jobs behind one login.",
      "Ninja Chat handles day-to-day drafting, research, and quick answers, with web search and citations when you need current information instead of what the model already knows. Imaginative Ninja generates on-brand images from a text prompt, with presets for the formats founders actually need, like social posts, ad creative, and website heroes.",
      "Web Builder turns a short business description into a working site through a three-step wizard, then hands you a full drag-and-drop editor if you want to keep tuning it. Social Pro connects your LinkedIn, X, Instagram, and Facebook accounts and handles writing, scheduling, and a content calendar from one dashboard.",
      "Ninja Sales gives you a real lead list and pipeline instead of a spreadsheet, and Ninja Legal helps you draft, review, and compare contracts faster, with a clear reminder throughout that it's assistance, not a substitute for a lawyer. Each tool works on its own, but they share your business context, so a chat conversation and a social post can both reflect the same brand without you repeating yourself.",
    ],
    readTime: "4 min read",
  },
  {
    slug: "ninja-chat-remembers-business-facts",
    title: "Ninja Chat Now Remembers Key Facts About Your Business",
    category: "Feature Drop",
    date: "June 2026",
    image: "/images/chat-feature.png",
    excerpt:
      "Save a fact from any conversation, like your return policy or preferred tone, and Ninja Chat will use it in future chats without you repeating yourself.",
    body: [
      "Until now, every new conversation with Ninja Chat started from zero. If you'd explained your refund policy or your brand's tone of voice last week, you had to explain it again this week. Chat memory fixes that.",
      "When Ninja Chat gives you a useful answer, hovering over it now shows a Save to Memory option. Click it, and that fact gets stored against your account, not just that one conversation. The next time it's relevant, whether that's a different chat entirely or a reply three weeks later, Ninja Chat pulls it back in automatically.",
      "You can see and manage everything it remembers from Manage Saved Memories in the chat sidebar, including editing a fact that's changed or deleting one that no longer applies. Nothing is stored silently: you choose what gets remembered, one saved answer at a time.",
    ],
    readTime: "2 min read",
  },
  {
    slug: "web-builder-28-templates",
    title: "Web Builder's Template Library Grows to 28 Designs",
    category: "Product Update",
    date: "July 2026",
    image: "/images/builder-banner.png",
    excerpt:
      "New templates cover industries like nonprofits, event planning, interior design, photography, dental and veterinary practices, financial advisors, and moving companies.",
    body: [
      "Web Builder's three-step wizard picks a starting template based on your business description and the vibe you choose, then pre-fills it with your name, logo, and brand color. The more templates that exist, the better that starting point tends to be, so we've spent the last few weeks adding more.",
      "The library now covers 28 industries, up from the original set focused mostly on SaaS, agencies, and general small business. New additions include nonprofits, event planning, interior design, photography portfolios, dental and veterinary practices, financial advisors, and moving and storage companies.",
      "Every template is a full multi-section page, not a single hero block with placeholder text. Once you're in the editor, everything is still yours to rearrange, restyle, or rewrite; the template just gives you somewhere better than a blank canvas to start from.",
    ],
    readTime: "2 min read",
  },
  {
    slug: "connecting-custom-domain-ssl",
    title: "Connecting a Custom Domain: What Actually Happens Behind the Scenes",
    category: "How It Works",
    date: "July 2026",
    image: "/images/website-demo.png",
    excerpt:
      "Point your DNS at Startup Ninja, verify ownership, and a security certificate gets issued automatically, usually within a few minutes, no separate hosting or SSL provider needed.",
    body: [
      "A published Web Builder site gets a free startupninja.ai subdomain automatically, but most businesses want their own domain. Here's what happens when you connect one from Domain Settings.",
      "First, you point your domain's DNS at Startup Ninja, either automatically if you're on GoDaddy or Namecheap, or manually by adding the records yourself for any other registrar. Once DNS has propagated, you verify the domain in-app.",
      "That verification step is also what kicks off certificate issuance: a request goes out for a real security certificate for your domain, and once it's issued, your site is served over HTTPS with no separate hosting account or SSL provider to manage. This whole path, from DNS verification through certificate issuance and reload, was tested end-to-end against Let's Encrypt's own test infrastructure before shipping, so the mechanics are verified, not just written and hoped for.",
      "Propagation time depends on your registrar and can occasionally take longer than a few minutes, but for most domains the certificate is live shortly after verification succeeds.",
    ],
    readTime: "3 min read",
  },
  {
    slug: "imaginative-ninja-brand-assets",
    title: "Imaginative Ninja Adds Brand Assets for On-Brand Generations",
    category: "Feature Drop",
    date: "July 2026",
    image: "/images/image-banner.png",
    excerpt:
      "Save your logo, brand colors, fonts, and product photos once, then apply them to every image you generate instead of describing your brand in every prompt.",
    body: [
      "Generating an on-brand image used to mean describing your brand every time: the colors, the logo, the general style, all typed out in the prompt box. Brand Assets removes that repetition.",
      "Open the Brand Assets panel once and save your logo, up to ten brand colors, up to five fonts, and up to eight product photos, along with any notes about your visual style. From then on, an Apply My Brand Assets toggle appears when you generate, and turning it on sends your actual logo and product photos to the model as reference images, not just a text description of them.",
      "The difference shows up most in generations that need to include your real logo rather than inventing a similar-looking one. It's an opt-in toggle rather than a default, so brand guidance only shows up in generations where you actually want it.",
    ],
    readTime: "2 min read",
  },
  {
    slug: "ninja-legal-contract-comparison",
    title: "Ninja Legal Adds Side-by-Side Contract Comparison",
    category: "Feature Drop",
    date: "August 2026",
    image: "/images/ninja-legal-banner.png",
    excerpt:
      "Upload two versions of a contract and get a structured breakdown of what changed, which terms shifted in whose favor, and what to review before signing.",
    body: [
      "A redlined contract from the other side is one of the most common documents a founder gets stuck staring at, trying to work out what actually changed and who it now favors. Contract Comparison is built for exactly that moment.",
      "Upload both versions of a contract, and Ninja Legal reads the actual text of each and returns a structured table of what's different: payment terms, termination clauses, liability language, IP ownership, whatever shifted between the two drafts. Alongside the differences, it gives a plain-English read on which version is more favorable to which side.",
      "As with every part of Ninja Legal, this is framed as assistance, not legal advice, with a disclaimer built into both the interface and the exported comparison. It's meant to help you walk into a conversation with a lawyer already knowing what changed, not replace that conversation.",
    ],
    readTime: "3 min read",
  },
  {
    slug: "how-compliance-scan-works",
    title: "How Ninja Legal's Compliance Scan Actually Works",
    category: "How It Works",
    date: "August 2026",
    image: "/images/legal-ai-bg.png",
    excerpt:
      "It checks the wording of a document you upload against a GDPR, security, and HIPAA checklist, flagging what's covered, partial, or missing. It reviews your document, not your infrastructure, and it's not a replacement for a lawyer.",
    body: [
      "It's worth being precise about what Compliance Scan does, because the name invites the wrong assumption. This is not infrastructure scanning. Startup Ninja doesn't connect to your servers, your cloud accounts, or anything else technical, and it never claims to.",
      "What it actually does: you upload a document, like a privacy policy or a security policy, and it checks the wording against a defined checklist covering things like lawful basis for processing, data subject rights, retention, breach notification, encryption commitments, and incident response, plus HIPAA-specific items when they're relevant. Each area comes back marked Covered, Partial, Missing, or Not Applicable, with findings explaining why.",
      "That makes it useful for catching an obvious gap in your policy's language before you publish it, not for certifying that your actual systems are secure or compliant. The tool says this directly in the product, and we're saying it again here: it reviews text, not infrastructure, and it isn't a substitute for a lawyer or a real compliance audit.",
    ],
    readTime: "3 min read",
  },
  {
    slug: "social-pro-video-posting",
    title:
      "Social Pro Now Posts Video to LinkedIn, X, Instagram, and Facebook",
    category: "Feature Drop",
    date: "September 2026",
    image: "/images/socialchat-banner.png",
    excerpt:
      "Video posting, previously limited to Instagram and Facebook, now works across all four connected platforms, both for immediate posts and scheduled ones.",
    body: [
      "Video has been possible on Instagram and Facebook in Social Pro for a while, through Instagram's Reels API and Facebook's Video API. LinkedIn and X didn't have it, and neither platform's scheduler could handle video at all. Both gaps are closed now.",
      "LinkedIn video posting uses LinkedIn's own Videos API: the file is uploaded in parts, finalized, and attached to a post once processing finishes. X uses its chunked upload flow, the same mechanism X's own apps use for larger media. Both are wired into Publish Now and into scheduling, so a video post can go out immediately or be queued for later, the same as an image or carousel post already could.",
      "You can now select any combination of LinkedIn, X, Instagram, and Facebook when attaching a video, where video used to be gated to Instagram and Facebook only. Everything else about posting, like AI-written captions and the content calendar, works the same way it already did for image posts.",
    ],
    readTime: "3 min read",
  },
  {
    slug: "ninja-sales-restore-deleted-leads",
    title: "Ninja Sales Adds Restore for Deleted Leads and Projects",
    category: "Product Update",
    date: "September 2026",
    image: "/images/ninja-sales-banner.png",
    excerpt:
      "Deleting a lead now soft-deletes it and anything linked to it, and both can be restored from the trash if you change your mind.",
    body: [
      "Deleting a lead you didn't mean to delete used to be permanent. It isn't anymore.",
      "Deleting a lead now moves it, along with any projects, tasks, and follow-ups linked to it, into a trash state rather than removing it outright. Proposals and invoices tied to that lead are left untouched, since those often need to stay on record even if the lead itself is gone. Only an owner or manager on the account can delete a lead in the first place, and the confirmation dialog explains exactly what's about to be affected before you confirm.",
      "If you change your mind, or delete the wrong record by mistake, everything in the trash can be restored from there, bringing back the lead and everything cascaded with it.",
    ],
    readTime: "2 min read",
  },
  {
    slug: "ninja-chat-web-search-tips",
    title: "Getting Better Answers from Ninja Chat's Web Search",
    category: "Tutorials",
    date: "September 2026",
    image: "/images/chat-feature.png",
    excerpt:
      "Toggle Search on before sending a message and Ninja Chat pulls in live information instead of relying only on what it already knows, with sources cited in the response.",
    body: [
      "Ninja Chat is useful without web search for anything that doesn't depend on current information, like drafting, brainstorming, or explaining a concept. But for anything time-sensitive, like current pricing, a recent announcement, or what a competitor just shipped, search makes a real difference.",
      "Toggle Search on in the composer before sending your message. When it's on, Ninja Chat looks up live information instead of relying only on what it already knew, and the response includes citation chips linking back to the pages it drew from, so you can check the source yourself rather than taking the answer on faith.",
      "It's worth turning on deliberately rather than leaving on for everything: search adds a step and isn't needed for a question that's really just about reasoning or drafting from information you've already given it. For anything grounded in what's true right now, though, it's the difference between a plausible-sounding guess and an answer with a source attached.",
    ],
    readTime: "2 min read",
  },
];

export const getArticleBySlug = (slug: string) =>
  newsArticles.find((article) => article.slug === slug);

// Newest first, for display.
export const newsArticlesByDate = [...newsArticles].reverse();
