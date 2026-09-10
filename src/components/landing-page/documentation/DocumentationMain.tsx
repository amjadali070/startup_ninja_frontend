import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaRocket,
  FaImage,
  FaCode,
  FaShareAlt,
  FaSearch,
  FaChartLine,
  FaBalanceScale,
  FaCog,
  FaUsers,
} from 'react-icons/fa';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

interface Article {
  title: string;
  content: string;
}

interface DocSection {
  icon: React.ReactNode;
  title: string;
  description: string;
  disclaimer?: string;
  articles: Article[];
}

const sections: DocSection[] = [
  {
    icon: <FaRocket className="w-10 h-10" />,
    title: 'Ninja Chat',
    description: 'Your AI assistant for day-to-day work: drafting, research, and quick answers.',
    articles: [
      {
        title: 'Getting Started with Ninja Chat',
        content:
          "Ninja Chat is an AI assistant for day-to-day work: drafting emails and copy, researching topics, brainstorming, and answering quick business questions. Start a new conversation with New Chat, type your question or request, and press Enter (Shift+Enter for a new line). Any response can be copied, and longer answers can be exported straight to PDF or DOCX.",
      },
      {
        title: 'Web Search & Citations',
        content:
          "Toggle Search in the composer before sending a message to let Ninja Chat pull in live information from the web instead of relying only on what it already knows. This is useful for anything time-sensitive, like current pricing, recent news, or a competitor's latest move. When search is used, the response cites the pages it drew from.",
      },
      {
        title: 'Attaching Files to a Conversation',
        content:
          "Use the paperclip icon (or drag and drop) to attach up to 5 files per message: PDF, DOCX, XLSX, CSV, TXT, PPTX, JPG, or PNG, up to 20MB each. Ninja Chat reads what you've uploaded and can summarize it, analyze it, or answer questions about it.",
      },
      {
        title: 'Chat Memory: Saving & Recalling Facts',
        content:
          "When Ninja Chat gives you a useful answer, hover over it and click Save to Memory to store that fact for future conversations, such as your business's return policy or a preferred tone of voice. Saved memories are used to inform later responses, and you can review, edit, or delete them anytime from Manage Saved Memories (the brain icon in the chat sidebar).",
      },
      {
        title: 'Searching & Managing Chat History',
        content:
          "Every conversation is saved to your Chat History sidebar. Search past chats by keyword: it matches against what was actually said, not just the chat title. You can also rename or delete conversations you no longer need.",
      },
    ],
  },
  {
    icon: <FaImage className="w-10 h-10" />,
    title: 'Imaginative Ninja',
    description: 'AI image generation with brand-aware presets, iterative editing, and version history.',
    articles: [
      {
        title: 'Generating Your First Image',
        content:
          "Describe what you want in the prompt box, choose an aspect ratio (square, widescreen, portrait, and more) and an art style (photorealistic, anime, digital art, oil painting, sketch, or cyberpunk), then click Generate Image. Prompts can run up to 4,000 characters, and the more descriptive the prompt, the better the result.",
      },
      {
        title: 'Presets & Aspect Ratios',
        content:
          "Presets are ready-made starting points that set a matching aspect ratio for common formats, so you don't have to configure one manually. Pick one from the Preset dropdown, or leave it on Custom to choose the aspect ratio yourself.",
      },
      {
        title: 'Brand Assets: Logo, Colors, Fonts & Products',
        content:
          "Open the Brand Assets panel to save your logo, up to 10 brand colors, up to 5 fonts, visual style notes, and up to 8 product photos. Once saved, toggle 'Apply my brand assets' when generating so new images stay on-brand.",
      },
      {
        title: 'Editing, Variations & Version History',
        content:
          "Open any image in your Library and click Continue Editing to describe a change, like 'change the background to a sunset,' without starting from scratch, or Create Variation for a fresh take on the same image. Every edit and variation is saved as a version you can browse from the image's Version History, and Compare Versions lets you view two side by side.",
      },
    ],
  },
  {
    icon: <FaCode className="w-10 h-10" />,
    title: 'Web Builder',
    description: 'A visual website builder with AI-assisted editing, custom domains, and one-click publishing.',
    articles: [
      {
        title: 'The 3-Step AI Website Wizard',
        content:
          "Starting a new site walks you through three steps: tell Ninja about your business (name, description, industry, goal, logo, and brand color), pick the 'vibe' and template that fit best, then preview the AI-filled draft before choosing to keep it as-is, edit it further, or publish right away.",
      },
      {
        title: 'Editing Your Site',
        content:
          "The editor is a full drag-and-drop builder: add and rearrange sections, edit text and images directly, and pull from a library of components (headers, hero sections, pricing cards, testimonials, FAQs, contact forms, and more). For an AI hand, select any element or section and click Ask Ninja to describe a change in plain language, like rewording copy or regenerating an image, instead of editing it by hand.",
      },
      {
        title: 'Templates',
        content:
          "New sites start from a template matched to your chosen vibe and industry, pre-filled with your business name, description, and logo. Templates cover SaaS, agencies, restaurants, real estate, e-commerce, portfolios, and more, and you can customize freely once you're in the editor.",
      },
      {
        title: 'Publishing Your Site',
        content:
          "Once you're happy with your draft, click Publish to make it live. Republishing after later edits works the same way: changes only go live when you explicitly publish them.",
      },
      {
        title: 'Connecting a Custom Domain',
        content:
          "From Domain Settings, enter a domain you already own (e.g. yourbrand.com) to connect it. You'll need to point its DNS at Startup Ninja, either through automatic setup for GoDaddy and Namecheap or by adding the records manually, then verify the domain once DNS has propagated. A security certificate (HTTPS) is issued automatically once verification succeeds, usually within a few minutes.",
      },
    ],
  },
  {
    icon: <FaShareAlt className="w-10 h-10" />,
    title: 'Social Pro',
    description: 'AI-written, multi-platform social posts with scheduling, a content calendar, and analytics.',
    articles: [
      {
        title: 'Connecting Your Accounts',
        content:
          "Connect LinkedIn, X (Twitter), Facebook, or Instagram from the Accounts panel. Each uses that platform's own sign-in, so Startup Ninja never sees your password, and Facebook and Instagram connections let you pick which Page to post from.",
      },
      {
        title: 'Writing & Repurposing Posts with AI',
        content:
          "Describe what you want to say and let AI draft a post, or paste in existing content, such as a blog excerpt or an announcement, and use Content Repurposing to turn it into platform-specific variants: Instagram, Facebook, LinkedIn, and X captions, a Reel/video script, and a blog opening, all in your saved brand voice.",
      },
      {
        title: 'Carousels, Video & Scheduling',
        content:
          "Attach up to 4 images to a single post to create a carousel, or attach one video (up to 100MB) for a Reel. A post can be one or the other, not both. Publish immediately or schedule it for later from the Content Calendar, where you can see everything queued across your connected accounts at a glance.",
      },
      {
        title: 'Understanding Your Analytics',
        content:
          "The Analytics tab shows real posting activity across every connected account, including totals, success rate, and a breakdown by day and platform. Engagement numbers (likes, comments, shares) are only available for Facebook and Instagram, pulled directly from those platforms' own APIs. LinkedIn and X don't expose that data the same way, so engagement isn't shown for them.",
      },
    ],
  },
  {
    icon: <FaChartLine className="w-10 h-10" />,
    title: 'Ninja Sales',
    description: 'A lightweight CRM for leads, projects, proposals, and invoices, built for small teams.',
    articles: [
      {
        title: 'Leads: Table & Status',
        content:
          "The Leads page lists every lead in a sortable, searchable table. Filter by status, and change a lead's status directly from a dropdown in its row. Leads can be assigned to a specific team member if you're the account owner or a Manager.",
      },
      {
        title: 'Projects Pipeline (Kanban)',
        content:
          "Projects Pipeline gives you a drag-and-drop kanban view of every deal moving through your stages: New, Contacted, Qualified, Proposal, Negotiation, Converted, Closed Won, Closed Lost, and Hold. Drag a card between columns to update its stage.",
      },
      {
        title: 'Proposals & Invoices',
        content:
          "Generate a proposal or invoice from a template, send it, and track its status (draft, sent, paid, and so on) from the Proposals and Invoices pages. Any of them can be downloaded as a PDF.",
      },
      {
        title: 'Follow-Ups & Reminders',
        content:
          "The Follow-ups page tracks who needs outreach today, what's overdue, and what's coming up, with AI-suggested outreach messages to help you respond faster.",
      },
    ],
  },
  {
    icon: <FaBalanceScale className="w-10 h-10" />,
    title: 'Ninja Legal',
    description: 'AI-drafted contracts, document analysis and comparison, and a compliance-wording scan.',
    disclaimer:
      "Everything in Ninja Legal, including generated contracts, analysis, comparisons, and compliance scans, is AI-assisted, not legal advice. Have a licensed attorney review anything before you sign or rely on it.",
    articles: [
      {
        title: 'Generating a Contract',
        content:
          "Contract Generation walks you through a guided, chat-style flow: answer a few questions about what you need and Ninja Legal produces a starting draft you can review, edit, and download.",
      },
      {
        title: 'Analyzing an Uploaded Document',
        content:
          "Upload a PDF, DOCX, or TXT contract under Analyze Contract and Ninja Legal reviews it, surfacing a summary and notable terms so you know what you're looking at before signing.",
      },
      {
        title: 'Comparing Two Contracts',
        content:
          "Compare Contracts lets you upload two versions of a document and see what changed between them, useful for reviewing a redline from a client or counterparty.",
      },
      {
        title: 'Compliance Scan',
        content:
          "Compliance Scan checks an uploaded document's wording against a set of common compliance areas (GDPR, Security & Confidentiality, and HIPAA) and flags each as Covered, Partial, Missing, or Not Applicable, with an overall readiness rating. This is a wording check on the document itself, not a scan of your actual infrastructure or systems.",
      },
    ],
  },
  {
    icon: <FaCog className="w-10 h-10" />,
    title: 'Settings',
    description: 'Profile, business info, security, billing, connections, data export, and account deletion.',
    articles: [
      {
        title: 'Profile & Business Info',
        content:
          "Update your name, email, and profile photo under Profile, and your business details (name, industry, website, description, target customer, products, brand tone, and goals) under Business Info. This business context is what grounds AI output across the product in your real business, rather than generic filler.",
      },
      {
        title: 'Security',
        content: "Change your password anytime from the Security section of Settings.",
      },
      {
        title: 'Billing & Plans',
        content:
          "View your current plan and usage, compare plans, and upgrade or downgrade from Settings. Upgrades apply immediately and are prorated, while downgrades take effect at your next billing cycle. Manage your saved payment method here too.",
      },
      {
        title: 'Connections & Data Export',
        content:
          "Connections & Data links out to where your connected accounts, domains, and chat memory actually live (Social Pro, Web Builder, and Ninja Chat Memories respectively), plus a one-click export of your account data (profile, business info, subscription, and billing history).",
      },
      {
        title: 'Deleting Your Account',
        content:
          "Delete Account permanently removes your account and your content (images, documents, contracts, posts, websites, and chats) from every part of the product. This can't be undone, and requires confirming twice before it proceeds.",
      },
    ],
  },
  {
    icon: <FaUsers className="w-10 h-10" />,
    title: 'Team Management',
    description: 'Invite teammates and control what each of them can access, module by module.',
    articles: [
      {
        title: 'Inviting Team Members',
        content:
          "Add a teammate from Manage Team either by sending a real email invite, where they set their own password when they accept, or by setting a password for them directly, useful when they're right there with you. Either way, assign them a role and department when you add them.",
      },
      {
        title: 'Role-Based Permissions',
        content:
          "Grant or restrict access per module (like Sales or Legal) when you add or edit a team member, so teammates only see the parts of the product relevant to their role. Only the account owner or a Manager can invite members, assign leads, or change permissions.",
      },
    ],
  },
];

const norm = (value: string) => value.toLowerCase();

const DocumentationMain: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [openArticles, setOpenArticles] = useState<Set<string>>(new Set());

  const isSearching = searchQuery.trim().length > 0;
  const query = norm(searchQuery.trim());

  const results = useMemo(() => {
    if (!isSearching) {
      return sections.map((section) => ({ section, articles: section.articles }));
    }

    return sections
      .map((section) => {
        const sectionMatches =
          norm(section.title).includes(query) || norm(section.description).includes(query);
        const matchedArticles = section.articles.filter(
          (article) => norm(article.title).includes(query) || norm(article.content).includes(query)
        );
        return {
          section,
          articles: sectionMatches ? section.articles : matchedArticles,
        };
      })
      .filter(({ articles }) => articles.length > 0);
  }, [isSearching, query]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const toggleArticle = (key: string) => {
    setOpenArticles((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span style={{color: '#D23621'}}>Documentation</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{color: '#CCCCCC'}}>
            Everything you need to master Startup Ninja
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{color: '#999'}} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 bg-black rounded-lg focus:outline-none transition-colors border border-white/10 focus:border-red-600/50"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {isSearching && results.length === 0 && (
            <p className="text-center py-10" style={{color: '#CCCCCC'}}>
              No articles match "{searchQuery.trim()}". Try a different search term, or{' '}
              <Link to="/contact" className="underline" style={{color: '#D23621'}}>contact support</Link>.
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {results.map(({ section, articles }) => {
              const isOpen = isSearching || openSections.has(section.title);
              return (
                <div
                  key={section.title}
                  className="rounded-2xl p-8 bg-[#141010] border border-white/10 shadow-lg transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="w-full text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start justify-between">
                      <div style={{color: '#D23621'}}>{section.icon}</div>
                      {isOpen ? (
                        <FiChevronDown className="w-5 h-5 mt-2" style={{color: '#D23621'}} />
                      ) : (
                        <FiChevronRight className="w-5 h-5 mt-2" style={{color: '#D23621'}} />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mt-4 mb-4">{section.title}</h3>
                    <p className="mb-2" style={{color: '#CCCCCC'}}>{section.description}</p>
                  </button>

                  {section.disclaimer && (
                    <p className="text-xs italic mb-4 mt-2" style={{color: '#E5A0A0'}}>
                      {section.disclaimer}
                    </p>
                  )}

                  {isOpen && (
                    <ul className="space-y-1 mt-4 border-t pt-4" style={{borderColor: '#333'}}>
                      {articles.map((article) => {
                        const key = `${section.title}:${article.title}`;
                        const articleOpen = isSearching || openArticles.has(key);
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              onClick={() => toggleArticle(key)}
                              className="w-full text-left transition-colors flex items-center justify-between py-2.5"
                              style={{color: '#CCCCCC'}}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#D23621'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#CCCCCC'}
                            >
                              <span className="flex items-center font-medium">
                                <span className="mr-2">→</span>
                                {article.title}
                              </span>
                              {articleOpen ? <FiChevronDown className="w-4 h-4 shrink-0" /> : <FiChevronRight className="w-4 h-4 shrink-0" />}
                            </button>
                            {articleOpen && (
                              <p className="text-sm leading-relaxed pb-3 pl-6" style={{color: '#AAAAAA'}}>
                                {article.content}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Need More Help?</h2>
          <p className="text-xl mb-8" style={{color: '#CCCCCC'}}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'}}
          >
            CONTACT SUPPORT
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DocumentationMain;
