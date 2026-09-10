import { apiClient } from "./apiClient";

export interface Party {
  name: string;
  type: "individual" | "company";
  email?: string | null;
  address?: string | null;
}

export const DOCUMENT_TYPES: { id: string; label: string }[] = [
  { id: "general", label: "General Contract" },
  { id: "nda", label: "NDA" },
  { id: "service_agreement", label: "Service Agreement" },
  { id: "freelancer_agreement", label: "Freelancer Agreement" },
  { id: "employment_agreement", label: "Employment Agreement" },
  { id: "contractor_agreement", label: "Contractor Agreement" },
  { id: "partnership_agreement", label: "Partnership Agreement" },
  { id: "consulting_agreement", label: "Consulting Agreement" },
  { id: "terms_of_service", label: "Terms of Service" },
  { id: "privacy_policy", label: "Privacy Policy" },
  { id: "refund_policy", label: "Refund Policy" },
];

export function documentTypeLabel(documentType?: string | null): string {
  return DOCUMENT_TYPES.find((d) => d.id === documentType)?.label || "General Contract";
}

export interface CreateContractRequest {
  contractTitle: string;
  documentType?: string;
  purpose: string;
  priority: string;
  parties: Party[];
  contractWorth?: string | null;
  termsConditions: string;
  contractStatus: string;
  expiryDate: string;
}

export interface Contract extends CreateContractRequest {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ContractListItem {
  contractId: string;
  contractTitle: string;
  documentType?: string;
  contractStatus: "active" | "inactive";
  expiryDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  isReadyForGeneration?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalContracts: number;
  totalPages: number;
}

export interface ContractListResponse {
  success: boolean;
  message: string;
  data: ContractListItem[];
  pagination: PaginationInfo;
}

export interface ActiveContractListItem {
  contractId: string;
  contractTitle: string;
  contractStatus: "active" | "inactive";
  expiryDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  contractWorth?: string | null;
  isReadyForGeneration?: boolean;
}

export interface ActiveContractListResponse {
  success: boolean;
  message: string;
  data: ActiveContractListItem[];
  pagination: PaginationInfo;
}

export interface ContractDetails {
  _id: string;
  contractTitle: string;
  documentType?: string;
  purpose: string;
  priority: "low" | "medium" | "high" | "urgent";
  parties: Party[];
  contractWorth?: string | null;
  termsConditions: string;
  contractStatus: "active" | "inactive";
  expiryDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isReadyForGeneration?: boolean;
}

export interface KpiData {
  workloadHeatMap: {
    totalContracts: number;
    priority: {
      urgent: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  complexityIndex: number;
  HighvalueContracts: number;
  expirySummary: {
    expiringIn90Days: number;
    expiredCount: number;
  };
}

export interface KpiResponse {
  success: boolean;
  message: string;
  data: KpiData;
}

export interface DashboardData {
  activeContracts: {
    total: number;
    thisMonth: number;
  };
  complianceHealth: {
    complianceScore: number;
    completeContracts: number;
    totalContracts: number;
  };
  contractValue: {
    totalActiveContractNO: number;
    thisMonthContractWorth: number;
    thisMonthContractWorthNo: number;
    totalContractWorth: number;
    noOfContractsThatHasWorth: number;
  };
  upcomingRenewals: number;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface ContractSection {
  id: string;
  title: string;
  content: string;
  order: number;
  updatedAt?: string;
}

export interface GenerateContractRequest {
  startDate: string;
  headerLogo?: string | null;
  footerText?: string | null;
}

export interface GenerateContractResponse {
  success: boolean;
  message: string;
  data?: {
    generatedContractId: string;
    sections: ContractSection[];
    startDate: string;
    headerLogo?: string | null;
    footerText?: string | null;
  };
  error?: string;
}

export interface UpdateSectionRequest {
  userFeedback: string;
}

export interface UpdateSectionResponse {
  success: boolean;
  message: string;
  data?: {
    sectionId: string;
    content: string;
    updatedAt: string;
    version: number;
  };
  error?: string;
}

export interface RiskyClause {
  clause: string;
  risk: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

export interface ContractAnalysis {
  summary: string;
  obligations: string[];
  paymentTerms: string[];
  terminationClauses: string[];
  riskyClauses: RiskyClause[];
  plainEnglishExplanation: string;
}

export interface UploadedContractSummary {
  _id: string;
  originalFilename: string;
  fileUrl: string;
  analysisStatus: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface UploadedContractDetails extends UploadedContractSummary {
  userId: string;
  fileKey: string;
  extractedText: string;
  textTruncated: boolean;
  analysis: ContractAnalysis | null;
  analysisError: string | null;
}

export interface UploadedContractListResponse {
  success: boolean;
  message?: string;
  data: UploadedContractSummary[];
  pagination: { currentPage: number; pageSize: number; total: number; totalPages: number };
}

export interface UploadedContractResponse {
  success: boolean;
  message?: string;
  data?: UploadedContractDetails;
  error?: string;
}

export interface ContractComparisonResult {
  overview: string;
  keyDifferences: { aspect: string; documentA: string; documentB: string }[];
  favorability: string;
  recommendation: string;
}

export interface CompareContractsResponse {
  success: boolean;
  message?: string;
  data?: {
    documentA: { id: string; name: string };
    documentB: { id: string; name: string };
    comparison: ContractComparisonResult;
  };
  error?: string;
}

export interface ComplianceArea {
  area: string;
  category: "gdpr" | "security" | "hipaa";
  status: "covered" | "partial" | "missing" | "not_applicable";
  finding: string;
  recommendation: string;
}

export interface ComplianceResults {
  overallSummary: string;
  readinessLevel: "strong" | "needs_work" | "significant_gaps";
  areas: ComplianceArea[];
}

export interface ComplianceScanSummary {
  _id: string;
  documentName: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  results?: { readinessLevel?: ComplianceResults["readinessLevel"] } | null;
}

export interface ComplianceScanDetails {
  _id: string;
  documentName: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  userId: string;
  uploadedContractId: string;
  error: string | null;
  results: ComplianceResults | null;
}

export interface ComplianceScanListResponse {
  success: boolean;
  message?: string;
  data: ComplianceScanSummary[];
  pagination: { currentPage: number; pageSize: number; total: number; totalPages: number };
}

export interface ComplianceScanResponse {
  success: boolean;
  message?: string;
  data?: ComplianceScanDetails;
  error?: string;
}

/**
 * Ninja Legal Service
 * Handles all ninja-legal related API calls
 */
export const ninjaLegalService = {
  /**
   * Create a new contract
   * Sends contract data to the backend
   */
  async createContract(
    contractData: CreateContractRequest
  ): Promise<ApiResponse<Contract>> {
    try {
      const response = await apiClient.post<ApiResponse<Contract>>(
        "/ai-legal/create-contract",
        contractData
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create contract",
        error: error.message,
      };
    }
  },

  /**
   * Fetch contracts with pagination and filtering
   * @param page - Page number (starts from 1)
   * @param status - Filter by contract status (all|active|inactive)
   */
  async listContracts(page: number = 1, status: string = "all"): Promise<ContractListResponse> {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (status !== "all") {
        params.append("status", status);
      }
      const response = await apiClient.get<ContractListResponse>(
        `/ai-legal/contracts-listing?${params.toString()}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch contracts",
        data: [],
        pagination: {
          currentPage: page,
          pageSize: 0,
          totalContracts: 0,
          totalPages: 0,
        },
      };
    }
  },

  /**
   * Fetch contract details by ID
   * @param contractId - Contract ID
   */
  async getContractDetails(
    contractId: string
  ): Promise<ApiResponse<ContractDetails>> {
    try {
      const response = await apiClient.get<ApiResponse<ContractDetails>>(
        `/ai-legal/contract/${contractId}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch contract details",
        error: error.message,
      };
    }
  },

  /**
   * Update an existing contract
   * @param contractId - Contract ID
   * @param contractData - Updated contract data
   */
  async updateContract(
    contractId: string,
    contractData: CreateContractRequest
  ): Promise<ApiResponse<Contract>> {
    try {
      const response = await apiClient.put<ApiResponse<Contract>>(
        `/ai-legal/contracts/${contractId}`,
        contractData
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update contract",
        error: error.message,
      };
    }
  },

  /**
   * Delete a contract (cascades to its generated versions and chat history)
   * @param contractId - Contract ID
   */
  async deleteContract(
    contractId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(
        `/ai-legal/contracts/${contractId}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete contract",
      };
    }
  },

  /**
   * Fetch active contracts with pagination
   * @param page - Page number (starts from 1)
   */
  async listActiveExpiryContracts(page: number = 1): Promise<ActiveContractListResponse> {
    try {
      const response = await apiClient.get<ActiveContractListResponse>(
        `/ai-legal/list-active-expiry-contracts?page=${page}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch active contracts",
        data: [],
        pagination: {
          currentPage: page,
          pageSize: 0,
          totalContracts: 0,
          totalPages: 0,
        },
      };
    }
  },

  /**
   * Fetch contract KPIs (Key Performance Indicators)
   * Returns workload, complexity, high-value contracts, and expiry data
   */
  async getContractKpis(): Promise<KpiResponse> {
    try {
      const response = await apiClient.get<KpiResponse>(
        "/ai-legal/contracts-kpis"
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch KPI data",
        data: {
          workloadHeatMap: {
            totalContracts: 0,
            priority: {
              urgent: 0,
              high: 0,
              medium: 0,
              low: 0,
            },
          },
          complexityIndex: 0,
          HighvalueContracts: 0,
          expirySummary: {
            expiringIn90Days: 0,
            expiredCount: 0,
          },
        },
      };
    }
  },

  /**
   * Fetch contract dashboard data
   * Returns active contracts, compliance health, contract value, and upcoming renewals
   */
  async getContractDashboard(): Promise<DashboardResponse> {
    try {
      const response = await apiClient.get<DashboardResponse>(
        "/ai-legal/contract-dashboard-kpis"
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch dashboard data",
        data: {
          activeContracts: {
            total: 0,
            thisMonth: 0,
          },
          complianceHealth: {
            complianceScore: 0,
            completeContracts: 0,
            totalContracts: 0,
          },
          contractValue: {
            totalActiveContractNO: 0,
            thisMonthContractWorth: 0,
            thisMonthContractWorthNo: 0,
            totalContractWorth: 0,
            noOfContractsThatHasWorth: 0,
          },
          upcomingRenewals: 0,
        },
      };
    }
  },

  /**
   * Generate contract sections using AI
   * @param contractId - Contract ID
   * @param requestData - Generation request data (startDate, headerLogo, footerText)
   */
  async generateContractSections(
    contractId: string,
    requestData: GenerateContractRequest
  ): Promise<GenerateContractResponse> {
    try {
      const response = await apiClient.post<GenerateContractResponse>(
        `/ai-legal/generate-contract/${contractId}`,
        requestData
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to generate contract sections",
        error: error.message,
      };
    }
  },

  /**
   * Update a contract section with user feedback
   * @param generatedContractId - Generated contract ID
   * @param sectionId - Section ID to update
   * @param requestData - Update request data (userFeedback)
   */
  async updateContractSection(
    generatedContractId: string,
    sectionId: string,
    requestData: UpdateSectionRequest
  ): Promise<UpdateSectionResponse> {
    try {
      const response = await apiClient.post<UpdateSectionResponse>(
        `/ai-legal/update-contract-section/${generatedContractId}/${sectionId}`,
        requestData
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update contract section",
        error: error.message,
      };
    }
  },

  /**
   * Get the latest generated contract for a contract ID
   * @param contractId - Contract ID
   */
  async getLatestGeneratedContract(
    contractId: string
  ): Promise<GenerateContractResponse> {
    try {
      const response = await apiClient.get<GenerateContractResponse>(
        `/ai-legal/latest-generated-contract/${contractId}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "No generated contract found",
        error: error.message,
      };
    }
  },

  /**
   * Upload a contract document (PDF/DOCX/TXT) and run AI analysis on it
   */
  async uploadAndAnalyzeContract(file: File): Promise<UploadedContractResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post<UploadedContractResponse>(
        "/ai-legal/upload-contract",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to upload and analyze contract",
        error: error.message,
      };
    }
  },

  /**
   * Retry analysis for an uploaded contract
   */
  async reanalyzeContract(id: string): Promise<UploadedContractResponse> {
    try {
      const response = await apiClient.post<UploadedContractResponse>(
        `/ai-legal/uploaded-contract/${id}/reanalyze`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reanalyze contract",
        error: error.message,
      };
    }
  },

  /**
   * List uploaded contracts
   */
  async listUploadedContracts(page: number = 1): Promise<UploadedContractListResponse> {
    try {
      const response = await apiClient.get<UploadedContractListResponse>(
        `/ai-legal/uploaded-contracts?page=${page}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch uploaded contracts",
        data: [],
        pagination: { currentPage: page, pageSize: 0, total: 0, totalPages: 0 },
      };
    }
  },

  /**
   * Get an uploaded contract's full details and analysis
   */
  async getUploadedContract(id: string): Promise<UploadedContractResponse> {
    try {
      const response = await apiClient.get<UploadedContractResponse>(
        `/ai-legal/uploaded-contract/${id}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch uploaded contract",
        error: error.message,
      };
    }
  },

  /**
   * Delete an uploaded contract
   */
  async deleteUploadedContract(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(
        `/ai-legal/uploaded-contract/${id}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete uploaded contract",
      };
    }
  },

  /**
   * Compare two uploaded contracts
   */
  async compareContracts(
    contractIdA: string,
    contractIdB: string
  ): Promise<CompareContractsResponse> {
    try {
      const response = await apiClient.post<CompareContractsResponse>(
        "/ai-legal/compare-contracts",
        { contractIdA, contractIdB }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to compare contracts",
        error: error.message,
      };
    }
  },

  /**
   * Run a compliance-language scan against a previously-uploaded document
   */
  async runComplianceScan(uploadedContractId: string): Promise<ComplianceScanResponse> {
    try {
      const response = await apiClient.post<ComplianceScanResponse>(
        "/ai-legal/compliance-scan",
        { uploadedContractId }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to run compliance scan",
        error: error.message,
      };
    }
  },

  /**
   * Re-run a compliance scan
   */
  async rerunComplianceScan(scanId: string): Promise<ComplianceScanResponse> {
    try {
      const response = await apiClient.post<ComplianceScanResponse>(
        `/ai-legal/compliance-scan/${scanId}/rerun`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to re-run compliance scan",
        error: error.message,
      };
    }
  },

  /**
   * List past compliance scans
   */
  async listComplianceScans(page: number = 1): Promise<ComplianceScanListResponse> {
    try {
      const response = await apiClient.get<ComplianceScanListResponse>(
        `/ai-legal/compliance-scans?page=${page}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch compliance scans",
        data: [],
        pagination: { currentPage: page, pageSize: 0, total: 0, totalPages: 0 },
      };
    }
  },

  /**
   * Get a compliance scan's full results
   */
  async getComplianceScan(scanId: string): Promise<ComplianceScanResponse> {
    try {
      const response = await apiClient.get<ComplianceScanResponse>(
        `/ai-legal/compliance-scan/${scanId}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch compliance scan",
        error: error.message,
      };
    }
  },
};
