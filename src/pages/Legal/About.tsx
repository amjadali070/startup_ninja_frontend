const MODULES = [
  { name: "Ninja Chat", desc: "An AI assistant for day-to-day work: drafting, research, and quick answers, with memory, file attachments, and live web search." },
  { name: "Imaginative Ninja", desc: "AI image generation with brand-aware presets, iterative editing, and version history, for marketing graphics, product shots, and social content." },
  { name: "Web Builder", desc: "A visual website builder with AI-assisted section editing, custom domains, and one-click publishing." },
  { name: "Social Pro", desc: "AI-written, multi-platform social posts with scheduling, a content calendar, and real engagement analytics." },
  { name: "Ninja Legal", desc: "AI-drafted contracts and documents, contract analysis and comparison, and a compliance-review checklist, built to assist, not replace, a licensed attorney." },
  { name: "Ninja Sales", desc: "A lightweight CRM for leads, projects, proposals, and invoices, built for small teams." },
];

const About = () => {
  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-plus-jakarta">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">About Startup Ninja</h1>

            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                <p className="lead text-xl text-gray-400 mb-8">
                    An AI workspace built for founders and small teams: the tools you'd otherwise hire out or piece together from five different subscriptions, in one place.
                </p>

                <p>
                    Running a small business or an early-stage startup means wearing every hat: writing copy, designing graphics, building a website, posting on social media, drafting contracts, and chasing leads, usually without a marketing team, a designer, or a lawyer on staff. Startup Ninja is built around that reality: a single AI-powered workspace covering the tools a lean team actually needs day to day.
                </p>

                <h3 className="text-white text-xl font-bold mt-10 mb-6">What's inside</h3>
                <div className="not-prose grid sm:grid-cols-2 gap-4 mb-8">
                    {MODULES.map((m) => (
                        <div key={m.name} className="rounded-xl border border-white/10 bg-[#151515] p-5">
                            <h4 className="text-white font-bold mb-1.5">{m.name}</h4>
                            <p className="text-gray-400 text-sm">{m.desc}</p>
                        </div>
                    ))}
                </div>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">Our approach to AI</h3>
                <p>
                    Every AI feature in Startup Ninja is built to ground its output in your real business context (your brand voice, saved assets, and business profile) rather than generating generic filler. We're upfront about what's AI-generated and where it's genuinely useful versus where you still need a human, such as a licensed attorney for anything contract-related. See our <a href="/terms" className="text-red-400 hover:text-red-300">Terms</a> and <a href="/privacy" className="text-red-400 hover:text-red-300">Privacy Policy</a> for the specifics.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">Get in touch</h3>
                <p>
                    Questions, feedback, or a partnership idea? Visit our <a href="/contact" className="text-red-400 hover:text-red-300">Contact page</a>. We read every message.
                </p>
            </div>
        </div>
    </div>
  );
};

export default About;
