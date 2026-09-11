import { type FC } from 'react';

export type PlanUsage = {
  ai_chat_messages: number;
  generated_images: number;
  social_posts: number;
  ai_post_writer?: number;
  chat_bot_messages?: number;
  facebook_page_connect?: number;
  web_builder_sessions?: number;
  websites?: number;
  website_creation?: number;
  legal_contracts?: number;
  legal_contract_section_revisions?: number;
  team_members?: number;
  sales_leads?: number;
  sales_projects?: number;
};

export type PlanLimits = {
  ai_chat_messages: number;
  generated_images: number;
  social_posts: number;
  ai_post_writer?: number;
  chat_bot_messages?: number;
  facebook_page_connect?: number;
  web_builder_sessions?: number;
  websites?: number;
  website_creation?: number;
  legal_contracts?: number;
  legal_contract_section_revisions?: number;
  team_members?: number;
  sales_leads?: number;
  sales_projects?: number;
};

interface PlanDetailsProps {
  usage: PlanUsage;
  limits: PlanLimits;
}

const PlanDetails: FC<PlanDetailsProps> = ({ usage, limits }) => {
  const renderUsageItem = (label: string, used: number, limit: number) => {
    // Handle unlimited limits (e.g. 999999 or -1)
    const isUnlimited = limit >= 999999 || limit === -1;
    const percentage = isUnlimited ? 0 : Math.min(100, Math.max(0, (used / limit) * 100));
    const isNearLimit = percentage > 85;
    
    return (
      <div className="relative overflow-hidden bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-3.5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors duration-300 hover:bg-[#1E293B]/60 flex flex-col justify-center">
        {/* Stacked (label above the used/limit figure) rather than side-by-side: this card
            only ever renders in the narrow Settings sidebar, and a horizontal layout forced
            either the label or the number to truncate depending on which row's value string
            was longer. Stacking removes the width contention entirely. */}
        <div className="mb-2.5">
            <span className="block truncate text-[#aeb9d0] font-plus-jakarta text-[11px] tracking-widest uppercase font-bold">{label}</span>
            <div className="mt-1 flex items-baseline gap-1 font-mono">
                <span className="text-white text-[13px] font-bold">
                  {used.toLocaleString()}
                </span>
                <span className="text-[#87929a] text-[11px] font-medium tracking-wide">
                  / {isUnlimited ? '∞' : limit.toLocaleString()}
                </span>
            </div>
        </div>
        <div className="relative w-full bg-[#0a0f12] rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                isUnlimited 
                    ? 'bg-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                    : isNearLimit 
                        ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' 
                        : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
            }`}
            style={{ width: `${isUnlimited ? 100 : percentage}%` }}
          >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-[pulse_2s_ease-in-out_infinite_alternate]" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-5 pt-5 border-t border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white text-sm xs:text-base font-bold font-plus-jakarta">Usage Dashboard</h4>
        <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 text-[10px] font-bold uppercase tracking-wider">
          Real-time
        </span>
      </div>
      
      {/*
        This card only ever renders inside the narrow Settings sidebar (aside column,
        roughly 300-380px wide even on a 1440px desktop) — Tailwind's sm/lg/xl prefixes key
        off *viewport* width, not this container's width, so `xl:grid-cols-3` used to force
        3 columns into ~94px-wide tiles on desktop, clipping the numbers (e.g. "4,000" -> "4,00"
        and the limit on some tiles disappearing entirely). Capped at 2 columns, which is what
        the container can actually fit at any viewport size.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
          {renderUsageItem("AI Chat", usage.ai_chat_messages || 0, limits.ai_chat_messages || 0)}
          {renderUsageItem("AI Posts", usage.ai_post_writer || 0, limits.ai_post_writer || 0)}
          {renderUsageItem("Images", usage.generated_images || 0, limits.generated_images || 0)}
          {renderUsageItem("Chatbots", usage.chat_bot_messages || 0, limits.chat_bot_messages || 0)}
          {renderUsageItem("Social", usage.social_posts || 0, limits.social_posts || 0)}
          {renderUsageItem("Accounts", usage.facebook_page_connect || 0, limits.facebook_page_connect || 0)}
          {renderUsageItem("Websites", (usage.website_creation ?? usage.websites) || 0, (limits.website_creation ?? limits.websites) || 0)}
          {renderUsageItem("Builder", usage.web_builder_sessions || 0, limits.web_builder_sessions || 0)}
          {renderUsageItem("Contracts", usage.legal_contracts || 0, limits.legal_contracts || 0)}
          {renderUsageItem("Revisions", usage.legal_contract_section_revisions || 0, limits.legal_contract_section_revisions || 0)}
          {renderUsageItem("Team", usage.team_members || 0, limits.team_members || 0)}
          {renderUsageItem("Leads", usage.sales_leads || 0, limits.sales_leads || 0)}
          {renderUsageItem("Projects", usage.sales_projects || 0, limits.sales_projects || 0)}
      </div>
    </div>
  );
};

export default PlanDetails;
