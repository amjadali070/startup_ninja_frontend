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
  async listActiveContracts(page: number = 1): Promise<ActiveContractListResponse> {
    try {
      const response = await apiClient.get<ActiveContractListResponse>(
        `/ai-legal/list-active-contracts?page=${page}`
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
};
