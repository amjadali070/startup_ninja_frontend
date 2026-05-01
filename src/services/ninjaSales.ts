import { apiClient } from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Lead {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  leadStatus: string;
  source: string;
  assignedTo: string;
  /** Auth user id of assignee (team roster from admin team management) */
  assignedToUserId?: string | null;
  assignee?: { _id: string; fullname: string; email: string; teamRole?: string } | null;
  campaign: string;
  notes: string;
  decisionMaker: boolean;
  lastContactAt: string;
  createdAt: string;
  updatedAt: string;
  projects?: Project[];
  totalProjectValue?: number;
}

export interface CreateLeadRequest {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  leadStatus?: string;
  source?: string;
  assignedTo?: string;
  assignedToUserId?: string | null;
  campaign?: string;
  notes?: string;
  decisionMaker?: boolean;
}

export interface TeamAssigneeMember {
  _id: string;
  fullname: string;
  email: string;
  teamRole?: string | null;
  isOwner?: boolean;
}

export interface PipelineCard {
  id: string;
  company: string;
  contact: string;
  value: string;
  priority: 'HIGH' | 'MED' | 'LOW';
  date: string;
  avatar: string;
  lastActivity?: string;
  nextStep?: string;
  projectName?: string;
}

export interface PipelineColumn {
  id: string;
  title: string;
  cards: PipelineCard[];
}

export interface PricingItem {
  _id?: string;
  description: string;
  qty: number;
  rate: number;
}

export interface Proposal {
  _id: string;
  userId: string;
  leadId?: string | { _id: string; name: string; company: string };
  projectId?: string | { _id: string; name: string };
  docType: 'PROPOSAL' | 'INVOICE';
  clientName: string;
  projectTitle: string;
  reference: string;
  items: PricingItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentTerms: string;
  notes: string;
  clauses?: Array<{ title: string; body: string }>;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issuedDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  userId: string;
  leadId?: string | { _id: string; name: string; company: string };
  projectId?: string | { _id: string; name: string };
  docType: 'INVOICE';
  clientName: string;
  projectTitle: string;
  reference: string;
  items: PricingItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentTerms: string;
  notes: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issuedDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  _id: string;
  id: string;
  projectId: string;
  type: string;
  title: string;
  dueDate: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  notes: string;
  completed: boolean;
  completedAt: string | null;
  projectName: string;
  projectValue: number;
  projectCurrency: string;
  projectStage: string;
  projectIdStr: string;
  leadName: string;
  leadCompany: string;
  leadEmail: string;
  leadIdStr: string;
  computedTab: string;
  createdAt: string;
}

export interface FollowUpStats {
  today: number;
  overdue: number;
  upcoming: number;
  completed: number;
  total: number;
}

export interface SalesTask {
  _id: string;
  leadId: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface SalesActivity {
  _id: string;
  id: string;
  leadId: string;
  leadName: string;
  leadCompany: string;
  type: string;
  title: string;
  description: string;
  time: string;
  createdAt: string;
}

/** Shape returned on dashboard stats for the activity feed */
export interface DashboardRecentActivity {
  id: string;
  title: string;
  description?: string;
  type: string;
  leadName: string;
  leadCompany: string;
  time: string;
}

export interface RevenueForecastMonth {
  month: string;
  label: string;
  year: number;
  monthIndex: number;
  amount: number;
  percent: number;
  isForecast: boolean;
}

export interface RevenueForecastData {
  months: RevenueForecastMonth[];
  rangeLabel: string;
  peak: { amount: number; monthShort: string };
  avgMonthly: number;
}

export interface TopOpportunityRow {
  id: string;
  name: string;
  company: string;
  value: number;
  pipelineStage: string;
  confidence: number;
  forecastedCloseDate?: string | null;
}

export interface DashboardStats {
  stats: {
    totalLeads: number;
    activeLeads: number;
    pipelineValue: number;
    winRate: number;
    overdueFollowUps: number;
    leadGrowth: number;
  };
  pipelineByStage: Array<{ _id: string; count: number; value: number }>;
  revenueForecast?: RevenueForecastData;
  recentActivities: DashboardRecentActivity[];
  topOpportunities: TopOpportunityRow[];
  proposalStats: Record<string, { count: number; totalValue: number }>;
}

export interface Project {
  _id: string;
  userId: string;
  leadId: string | { _id: string; name: string; email: string; company: string; phone: string; jobTitle: string };
  name: string;
  description: string;
  pipelineStage: string;
  stageOrder: number;
  value: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  nextStep: string;
  competitor: string;
  urgency: string;
  budgetConfirmed: boolean;
  forecastedCloseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  leadId?: string;
  leadData?: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    notes?: string;
    leadStatus?: string;
  };
  name: string;
  description?: string;
  pipelineStage?: string;
  value?: number;
  currency?: string;
  priority?: string;
  confidence?: number;
  nextStep?: string;
  competitor?: string;
  urgency?: string;
  budgetConfirmed?: boolean;
  forecastedCloseDate?: string;
}

export interface LeadSearchResult {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  jobTitle: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface FollowUpSuggestionItem {
  followUpId: string;
  leadId: string;
  projectId: string;
  name: string;
  company: string;
  detail: string;
}

export interface ProjectAiSuggestions {
  recommendedAction: string;
  insight: string;
  bestTimeToFollowUp: string;
}

export interface LeadAiSuggestions {
  recommendedAction: string;
  insight: string;
  bestTimeToFollowUp: string;
  /** Short email-style body for the lead “Drafting Assistant” panel */
  draftSnippet: string;
}

export interface OutreachDraft {
  recipientName: string;
  intentLabel: string;
  body: string;
  reasons: string[];
}

interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination?: Pagination;
  message?: string;
}

interface ApiSingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const ninjaSalesService = {

  // ── Dashboard ──────────────────────────────────────────────────────────────

  async getDashboardStats(): Promise<ApiSingleResponse<DashboardStats>> {
    try {
      return await apiClient.get<ApiSingleResponse<DashboardStats>>('/ninja-sales/dashboard/stats');
    } catch (error: any) {
      return { success: false, data: {} as DashboardStats, message: error.response?.data?.message || 'Failed to fetch dashboard stats' };
    }
  },

  // ── AI (OpenAI) ────────────────────────────────────────────────────────────

  async postProjectSuggestions(projectId: string): Promise<ApiSingleResponse<ProjectAiSuggestions>> {
    try {
      return await apiClient.post<ApiSingleResponse<ProjectAiSuggestions>>('/ninja-sales/ai/project-suggestions', {
        projectId,
      });
    } catch (error: any) {
      return {
        success: false,
        data: {} as ProjectAiSuggestions,
        message: error.response?.data?.message || 'Failed to load AI suggestions',
      };
    }
  },

  async postLeadSuggestions(params: {
    leadId: string;
    projectId?: string;
  }): Promise<ApiSingleResponse<LeadAiSuggestions>> {
    try {
      return await apiClient.post<ApiSingleResponse<LeadAiSuggestions>>('/ninja-sales/ai/lead-suggestions', params);
    } catch (error: any) {
      return {
        success: false,
        data: {} as LeadAiSuggestions,
        message: error.response?.data?.message || 'Failed to load lead AI suggestions',
      };
    }
  },

  async postFollowUpSuggestions(): Promise<
    ApiSingleResponse<{ suggestions: FollowUpSuggestionItem[] }>
  > {
    try {
      return await apiClient.post<ApiSingleResponse<{ suggestions: FollowUpSuggestionItem[] }>>(
        '/ninja-sales/ai/follow-up-suggestions',
        {}
      );
    } catch (error: any) {
      return {
        success: false,
        data: { suggestions: [] },
        message: error.response?.data?.message || 'Failed to load follow-up suggestions',
      };
    }
  },

  async postOutreachDraft(params?: {
    projectId?: string;
    followUpId?: string;
  }): Promise<ApiSingleResponse<OutreachDraft>> {
    try {
      return await apiClient.post<ApiSingleResponse<OutreachDraft>>('/ninja-sales/ai/outreach-draft', params || {});
    } catch (error: any) {
      return {
        success: false,
        data: {} as OutreachDraft,
        message: error.response?.data?.message || 'Failed to generate outreach draft',
      };
    }
  },

  async postDashboardInsight(): Promise<ApiSingleResponse<{ insight: string }>> {
    try {
      return await apiClient.post<ApiSingleResponse<{ insight: string }>>('/ninja-sales/ai/dashboard-insight', {});
    } catch (error: any) {
      return {
        success: false,
        data: { insight: '' },
        message: error.response?.data?.message || 'Failed to load insight',
      };
    }
  },

  // ── Leads ──────────────────────────────────────────────────────────────────

  async getLeads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    source?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiListResponse<Lead>> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') query.set(key, String(val));
        });
      }
      const qs = query.toString();
      return await apiClient.get<ApiListResponse<Lead>>(`/ninja-sales/leads${qs ? `?${qs}` : ''}`);
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to fetch leads' };
    }
  },

  async getLeadById(id: string): Promise<ApiSingleResponse<Lead>> {
    try {
      return await apiClient.get<ApiSingleResponse<Lead>>(`/ninja-sales/leads/${id}`);
    } catch (error: any) {
      return { success: false, data: {} as Lead, message: error.response?.data?.message || 'Failed to fetch lead' };
    }
  },

  async getTeamAssignees(): Promise<
    ApiSingleResponse<{ ownerId: string; members: TeamAssigneeMember[] }>
  > {
    try {
      return await apiClient.get<ApiSingleResponse<{ ownerId: string; members: TeamAssigneeMember[] }>>(
        '/ninja-sales/leads/team-assignees'
      );
    } catch (error: any) {
      return {
        success: false,
        data: { ownerId: '', members: [] },
        message: error.response?.data?.message || 'Failed to load team',
      };
    }
  },

  async createLead(data: CreateLeadRequest): Promise<ApiSingleResponse<Lead>> {
    try {
      return await apiClient.post<ApiSingleResponse<Lead>>('/ninja-sales/leads', data);
    } catch (error: any) {
      return { success: false, data: {} as Lead, message: error.response?.data?.message || 'Failed to create lead' };
    }
  },

  async updateLead(id: string, data: Partial<CreateLeadRequest>): Promise<ApiSingleResponse<Lead>> {
    try {
      return await apiClient.put<ApiSingleResponse<Lead>>(`/ninja-sales/leads/${id}`, data);
    } catch (error: any) {
      return { success: false, data: {} as Lead, message: error.response?.data?.message || 'Failed to update lead' };
    }
  },

  async deleteLead(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.delete<{ success: boolean; message: string }>(`/ninja-sales/leads/${id}`);
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete lead' };
    }
  },

  // ── Pipeline ───────────────────────────────────────────────────────────────

  async getPipelineColumns(params?: {
    priority?: string;
    minValue?: number;
    maxValue?: number;
    search?: string;
    source?: string;
  }): Promise<ApiSingleResponse<PipelineColumn[]>> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') query.set(key, String(val));
        });
      }
      const qs = query.toString();
      return await apiClient.get<ApiSingleResponse<PipelineColumn[]>>(`/ninja-sales/pipeline/columns${qs ? `?${qs}` : ''}`);
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to fetch pipeline' };
    }
  },

  async movePipelineCard(data: {
    leadId: string;
    fromStage: string;
    toStage: string;
    newIndex: number;
  }): Promise<ApiSingleResponse<Lead>> {
    try {
      return await apiClient.put<ApiSingleResponse<Lead>>('/ninja-sales/pipeline/move', data);
    } catch (error: any) {
      return { success: false, data: {} as Lead, message: error.response?.data?.message || 'Failed to move card' };
    }
  },

  // ── Proposals ──────────────────────────────────────────────────────────────

  async getProposals(params?: {
    page?: number;
    limit?: number;
    status?: string;
    docType?: string;
    leadId?: string;
  }): Promise<ApiListResponse<Proposal>> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') query.set(key, String(val));
        });
      }
      const qs = query.toString();
      return await apiClient.get<ApiListResponse<Proposal>>(`/ninja-sales/proposals${qs ? `?${qs}` : ''}`);
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to fetch proposals' };
    }
  },

  async getProposalById(id: string): Promise<ApiSingleResponse<Proposal>> {
    try {
      return await apiClient.get<ApiSingleResponse<Proposal>>(`/ninja-sales/proposals/${id}`);
    } catch (error: any) {
      return { success: false, data: {} as Proposal, message: error.response?.data?.message || 'Failed to fetch proposal' };
    }
  },

  async createProposal(data: Partial<Proposal>): Promise<ApiSingleResponse<Proposal>> {
    try {
      return await apiClient.post<ApiSingleResponse<Proposal>>('/ninja-sales/proposals', data);
    } catch (error: any) {
      return { success: false, data: {} as Proposal, message: error.response?.data?.message || 'Failed to create proposal' };
    }
  },

  async updateProposal(id: string, data: Partial<Proposal>): Promise<ApiSingleResponse<Proposal>> {
    try {
      return await apiClient.put<ApiSingleResponse<Proposal>>(`/ninja-sales/proposals/${id}`, data);
    } catch (error: any) {
      return { success: false, data: {} as Proposal, message: error.response?.data?.message || 'Failed to update proposal' };
    }
  },

  async deleteProposal(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.delete<{ success: boolean; message: string }>(`/ninja-sales/proposals/${id}`);
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete proposal' };
    }
  },

  async sendProposal(id: string): Promise<ApiSingleResponse<Proposal>> {
    try {
      return await apiClient.post<ApiSingleResponse<Proposal>>(`/ninja-sales/proposals/${id}/send`, {});
    } catch (error: any) {
      return { success: false, data: {} as Proposal, message: error.response?.data?.message || 'Failed to send proposal' };
    }
  },

  async aiRefineProposal(id: string, instruction?: string): Promise<ApiSingleResponse<Proposal>> {
    try {
      return await apiClient.post<ApiSingleResponse<Proposal>>(`/ninja-sales/proposals/${id}/ai-refine`, { instruction, target: "all" });
    } catch (error: any) {
      return { success: false, data: {} as Proposal, message: error.response?.data?.message || 'Failed to refine proposal' };
    }
  },

  async aiRefineProposalClauses(id: string, instruction?: string): Promise<ApiSingleResponse<Proposal>> {
    try {
      return await apiClient.post<ApiSingleResponse<Proposal>>(`/ninja-sales/proposals/${id}/ai-refine`, { instruction, target: "clauses" });
    } catch (error: any) {
      return { success: false, data: {} as Proposal, message: error.response?.data?.message || 'Failed to refine clauses' };
    }
  },

  async convertProposalToInvoice(id: string): Promise<ApiSingleResponse<Proposal>> {
    try {
      // now returns an Invoice (separate module) but we keep response typed as Proposal-compatible
      return await apiClient.post<ApiSingleResponse<any>>(`/ninja-sales/proposals/${id}/convert-to-invoice`, {});
    } catch (error: any) {
      return { success: false, data: {} as Proposal, message: error.response?.data?.message || 'Failed to generate invoice' };
    }
  },

  async downloadProposalPdf(id: string): Promise<{ success: boolean; blob: Blob | null; filename?: string; message?: string }> {
    try {
      const client = apiClient.getAxiosInstance();
      const resp = await client.get(`/ninja-sales/proposals/${id}/pdf`, { responseType: 'blob' });
      const dispo = resp.headers?.['content-disposition'] as string | undefined;
      const match = dispo?.match(/filename="([^"]+)"/);
      const filename = match?.[1];
      return { success: true, blob: resp.data as Blob, filename };
    } catch (error: any) {
      return { success: false, blob: null, message: error.response?.data?.message || 'Failed to download PDF' };
    }
  },

  // ── Invoices ───────────────────────────────────────────────────────────────

  async getInvoices(params?: {
    page?: number;
    limit?: number;
    status?: string;
    leadId?: string;
    projectId?: string;
  }): Promise<ApiListResponse<Invoice>> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') query.set(key, String(val));
        });
      }
      const qs = query.toString();
      return await apiClient.get<ApiListResponse<Invoice>>(`/ninja-sales/invoices${qs ? `?${qs}` : ''}`);
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to fetch invoices' };
    }
  },

  async getInvoiceById(id: string): Promise<ApiSingleResponse<Invoice>> {
    try {
      return await apiClient.get<ApiSingleResponse<Invoice>>(`/ninja-sales/invoices/${id}`);
    } catch (error: any) {
      return { success: false, data: {} as Invoice, message: error.response?.data?.message || 'Failed to fetch invoice' };
    }
  },

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<ApiSingleResponse<Invoice>> {
    try {
      return await apiClient.put<ApiSingleResponse<Invoice>>(`/ninja-sales/invoices/${id}`, data);
    } catch (error: any) {
      return { success: false, data: {} as Invoice, message: error.response?.data?.message || 'Failed to update invoice' };
    }
  },

  async sendInvoice(id: string): Promise<ApiSingleResponse<Invoice>> {
    try {
      return await apiClient.post<ApiSingleResponse<Invoice>>(`/ninja-sales/invoices/${id}/send`, {});
    } catch (error: any) {
      return { success: false, data: {} as Invoice, message: error.response?.data?.message || 'Failed to send invoice' };
    }
  },

  async aiRefineInvoice(id: string, instruction?: string): Promise<ApiSingleResponse<Invoice>> {
    try {
      return await apiClient.post<ApiSingleResponse<Invoice>>(`/ninja-sales/invoices/${id}/ai-refine`, { instruction });
    } catch (error: any) {
      return { success: false, data: {} as Invoice, message: error.response?.data?.message || 'Failed to refine invoice' };
    }
  },

  async downloadInvoicePdf(id: string): Promise<{ success: boolean; blob: Blob | null; filename?: string; message?: string }> {
    try {
      const client = apiClient.getAxiosInstance();
      const resp = await client.get(`/ninja-sales/invoices/${id}/pdf`, { responseType: 'blob' });
      const dispo = resp.headers?.['content-disposition'] as string | undefined;
      const match = dispo?.match(/filename="([^"]+)"/);
      const filename = match?.[1];
      return { success: true, blob: resp.data as Blob, filename };
    } catch (error: any) {
      return { success: false, blob: null, message: error.response?.data?.message || 'Failed to download invoice PDF' };
    }
  },

  // ── Project-linked Documents ───────────────────────────────────────────────

  async getProjectDocuments(projectId: string): Promise<ApiSingleResponse<{ proposals: Proposal[]; invoices: Invoice[] }>> {
    try {
      return await apiClient.get<ApiSingleResponse<{ proposals: Proposal[]; invoices: Invoice[] }>>(`/ninja-sales/projects/${projectId}/documents`);
    } catch (error: any) {
      return { success: false, data: { proposals: [], invoices: [] }, message: error.response?.data?.message || 'Failed to fetch project documents' };
    }
  },

  async generateProposalFromProject(projectId: string, data?: Partial<Proposal>): Promise<ApiSingleResponse<Proposal>> {
    try {
      return await apiClient.post<ApiSingleResponse<Proposal>>(`/ninja-sales/projects/${projectId}/generate-proposal`, data || {});
    } catch (error: any) {
      return { success: false, data: {} as Proposal, message: error.response?.data?.message || 'Failed to generate proposal' };
    }
  },

  async generateInvoiceFromProject(projectId: string, data?: Partial<Invoice>): Promise<ApiSingleResponse<Invoice>> {
    try {
      return await apiClient.post<ApiSingleResponse<Invoice>>(`/ninja-sales/projects/${projectId}/generate-invoice`, data || {});
    } catch (error: any) {
      return { success: false, data: {} as Invoice, message: error.response?.data?.message || 'Failed to generate invoice' };
    }
  },

  // ── Follow-ups ─────────────────────────────────────────────────────────────

  async getFollowUps(params?: {
    tab?: string;
    projectId?: string;
    completed?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiListResponse<FollowUp>> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') query.set(key, String(val));
        });
      }
      const qs = query.toString();
      return await apiClient.get<ApiListResponse<FollowUp>>(`/ninja-sales/follow-ups${qs ? `?${qs}` : ''}`);
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        message: error.response?.data?.message || 'Failed to fetch follow-ups',
      };
    }
  },

  async getFollowUpStats(): Promise<ApiSingleResponse<FollowUpStats>> {
    try {
      return await apiClient.get<ApiSingleResponse<FollowUpStats>>('/ninja-sales/follow-ups/stats');
    } catch (error: any) {
      return { success: false, data: { today: 0, overdue: 0, upcoming: 0, completed: 0, total: 0 }, message: error.response?.data?.message || 'Failed to fetch follow-up stats' };
    }
  },

  async createFollowUp(data: {
    projectId: string;
    type: string;
    title: string;
    dueDate: string;
    urgency?: string;
    notes?: string;
  }): Promise<ApiSingleResponse<FollowUp>> {
    try {
      return await apiClient.post<ApiSingleResponse<FollowUp>>('/ninja-sales/follow-ups', data);
    } catch (error: any) {
      return { success: false, data: {} as FollowUp, message: error.response?.data?.message || 'Failed to create follow-up' };
    }
  },

  async updateFollowUp(id: string, data: Partial<FollowUp>): Promise<ApiSingleResponse<FollowUp>> {
    try {
      return await apiClient.put<ApiSingleResponse<FollowUp>>(`/ninja-sales/follow-ups/${id}`, data);
    } catch (error: any) {
      return { success: false, data: {} as FollowUp, message: error.response?.data?.message || 'Failed to update follow-up' };
    }
  },

  async deleteFollowUp(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.delete<{ success: boolean; message: string }>(`/ninja-sales/follow-ups/${id}`);
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete follow-up' };
    }
  },

  // ── Tasks ──────────────────────────────────────────────────────────────────

  async getTasks(params?: {
    leadId?: string;
    completed?: string;
  }): Promise<ApiSingleResponse<SalesTask[]>> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') query.set(key, String(val));
        });
      }
      const qs = query.toString();
      return await apiClient.get<ApiSingleResponse<SalesTask[]>>(`/ninja-sales/tasks${qs ? `?${qs}` : ''}`);
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to fetch tasks' };
    }
  },

  async createTask(data: {
    leadId: string;
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  }): Promise<ApiSingleResponse<SalesTask>> {
    try {
      return await apiClient.post<ApiSingleResponse<SalesTask>>('/ninja-sales/tasks', data);
    } catch (error: any) {
      return { success: false, data: {} as SalesTask, message: error.response?.data?.message || 'Failed to create task' };
    }
  },

  async updateTask(id: string, data: Partial<SalesTask>): Promise<ApiSingleResponse<SalesTask>> {
    try {
      return await apiClient.put<ApiSingleResponse<SalesTask>>(`/ninja-sales/tasks/${id}`, data);
    } catch (error: any) {
      return { success: false, data: {} as SalesTask, message: error.response?.data?.message || 'Failed to update task' };
    }
  },

  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.delete<{ success: boolean; message: string }>(`/ninja-sales/tasks/${id}`);
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete task' };
    }
  },

  // ── Activities ─────────────────────────────────────────────────────────────

  async getActivities(params?: {
    leadId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiListResponse<SalesActivity>> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') query.set(key, String(val));
        });
      }
      const qs = query.toString();
      return await apiClient.get<ApiListResponse<SalesActivity>>(`/ninja-sales/activities${qs ? `?${qs}` : ''}`);
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to fetch activities' };
    }
  },

  async createActivity(data: {
    leadId: string;
    type: string;
    title: string;
    description?: string;
  }): Promise<ApiSingleResponse<SalesActivity>> {
    try {
      return await apiClient.post<ApiSingleResponse<SalesActivity>>('/ninja-sales/activities', data);
    } catch (error: any) {
      return { success: false, data: {} as SalesActivity, message: error.response?.data?.message || 'Failed to log activity' };
    }
  },

  // ── Lead Search ────────────────────────────────────────────────────────────

  async searchLeadsByEmail(email: string): Promise<ApiSingleResponse<LeadSearchResult[]>> {
    try {
      return await apiClient.get<ApiSingleResponse<LeadSearchResult[]>>(`/ninja-sales/leads/search?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to search leads' };
    }
  },

  // ── Projects ───────────────────────────────────────────────────────────────

  async getProjects(params?: {
    leadId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiListResponse<Project>> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') query.set(key, String(val));
        });
      }
      const qs = query.toString();
      return await apiClient.get<ApiListResponse<Project>>(`/ninja-sales/projects${qs ? `?${qs}` : ''}`);
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to fetch projects' };
    }
  },

  async createProject(data: CreateProjectRequest): Promise<ApiSingleResponse<Project>> {
    try {
      return await apiClient.post<ApiSingleResponse<Project>>('/ninja-sales/projects', data);
    } catch (error: any) {
      return { success: false, data: {} as Project, message: error.response?.data?.message || 'Failed to create project' };
    }
  },

  async updateProject(id: string, data: Partial<CreateProjectRequest>): Promise<ApiSingleResponse<Project>> {
    try {
      return await apiClient.put<ApiSingleResponse<Project>>(`/ninja-sales/projects/${id}`, data);
    } catch (error: any) {
      return { success: false, data: {} as Project, message: error.response?.data?.message || 'Failed to update project' };
    }
  },

  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.delete<{ success: boolean; message: string }>(`/ninja-sales/projects/${id}`);
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete project' };
    }
  },
};
