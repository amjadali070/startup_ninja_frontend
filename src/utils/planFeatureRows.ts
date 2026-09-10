import { Plan, PlanLimit } from "../services/plan";

export interface PlanFeatureRow {
  product: string;
  detail: string;
  included: boolean;
}

const UNLIMITED = -1;

const formatCount = (value: number, unit: string) => {
  if (value === UNLIMITED) return `Unlimited ${unit}`;
  return `${value.toLocaleString()} ${unit}`;
};

const pluralize = (value: number, singular: string, plural: string) =>
  value === 1 ? singular : plural;

// One row per real product, plus the two cross-product limits (file
// uploads, team seats) that matter regardless of which products a plan
// includes. Every plan renders all eight rows, honestly marked included or
// not, rather than a free-text list that varies in length per plan. That
// keeps card content, and height, consistent, and makes sure a plan that
// doesn't include a product still says so instead of just omitting it.
export const getPlanFeatureRows = (limits: PlanLimit): PlanFeatureRow[] => [
  {
    product: "Web Builder",
    detail:
      limits.website_creation > 0 || limits.website_creation === UNLIMITED
        ? formatCount(
            limits.website_creation,
            pluralize(limits.website_creation, "hosted website", "hosted websites")
          )
        : "Not included",
    included: limits.website_creation !== 0,
  },
  {
    product: "Ninja Chat",
    detail:
      limits.ai_chat_messages > 0 || limits.ai_chat_messages === UNLIMITED
        ? formatCount(limits.ai_chat_messages, "messages/mo")
        : "Not included",
    included: limits.ai_chat_messages !== 0,
  },
  {
    product: "Imaginative Ninja",
    detail:
      limits.generated_images > 0 || limits.generated_images === UNLIMITED
        ? formatCount(limits.generated_images, "images/mo")
        : "Not included",
    included: limits.generated_images !== 0,
  },
  {
    product: "Social Pro",
    detail:
      limits.social_posts > 0 || limits.social_posts === UNLIMITED
        ? formatCount(limits.social_posts, "posts/mo")
        : "Not included",
    included: limits.social_posts !== 0,
  },
  {
    product: "Ninja Sales",
    detail:
      limits.sales_leads > 0 || limits.sales_leads === UNLIMITED
        ? formatCount(limits.sales_leads, "leads/mo")
        : "Not included",
    included: limits.sales_leads !== 0,
  },
  {
    product: "Ninja Legal",
    detail:
      limits.legal_contracts > 0 || limits.legal_contracts === UNLIMITED
        ? formatCount(limits.legal_contracts, "contracts/mo")
        : "Not included",
    included: limits.legal_contracts !== 0,
  },
  {
    product: "File uploads",
    detail:
      (limits.file_uploads ?? 0) > 0 || limits.file_uploads === UNLIMITED
        ? formatCount(limits.file_uploads, "uploads/mo")
        : "Not included",
    included: (limits.file_uploads ?? 0) !== 0,
  },
  {
    product: "Team",
    detail:
      limits.team_members === UNLIMITED
        ? "Unlimited members"
        : `${limits.team_members} team member${limits.team_members === 1 ? "" : "s"}`,
    included: true,
  },
];

// A dedicated version for the Custom/Enterprise tier, which uses -1
// ("configured per contract") across the board rather than real numbers.
export const getEnterpriseFeatureRows = (): PlanFeatureRow[] =>
  [
    ["Web Builder", "Custom website allowance"],
    ["Ninja Chat", "Custom message allowance"],
    ["Imaginative Ninja", "Custom image allowance"],
    ["Social Pro", "Custom post allowance"],
    ["Ninja Sales", "Custom lead allowance"],
    ["Ninja Legal", "Custom contract allowance"],
    ["File uploads", "Custom allowance"],
    ["Team", "Custom seats"],
  ].map(([product, detail]) => ({ product, detail, included: true }));

export const getFeatureRowsForPlan = (plan: Plan, isEnterprise: boolean) =>
  isEnterprise ? getEnterpriseFeatureRows() : getPlanFeatureRows(plan.limits);
