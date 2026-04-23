import { apiClient } from "./apiClient";

export interface Party {
  name: string;
  type: "individual" | "company";
  email?: string | null;
  address?: string | null;
}

export interface CreateContractRequest {
  contractTitle: string;
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
};
