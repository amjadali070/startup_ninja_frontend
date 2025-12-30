// Admin Dashboard Types

export interface DashboardMetric {
  value: string | number;
  label: string;
  trendPercentage?: string;
  trendType?: "positive" | "negative" | "neutral";
}

export interface DashboardStats {
  metrics: {
    totalUsers: DashboardMetric;
    activeUsers: DashboardMetric;
    newUsers: DashboardMetric;
    contentGenerated: DashboardMetric;
    moderationQueue: DashboardMetric;
  };
  systemHealth: {
    requestsPerSecond: string;
    avgLatency: string;
    errorRate: string;
    uptime: string;
  };
  totalPosts: number;
  totalWebsites: number;
}

export interface AIModel {
  name: string;
  tokens: string;
  cost: string;
  percentage: number;
}

export interface RealtimeUsageData {
  requestsPerSecond: string;
  avgLatency: string;
  errorRate: string;
  timeoutPercentage: string;
  chartData: number[];
  timeframe: string;
}

export interface SystemAlert {
  id: string;
  message: string;
  timestamp: string;
  severity?: "info" | "warning" | "error";
}

export interface UserListItem {
  _id: string;
  username: string;
  email: string;
  fullname?: string;
  role: "admin" | "user";
  status: number;
  loginType: "Apple" | "Microsoft" | "Google" | "Email";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  subscription?: "Free" | "Basic" | "Pro" | "Enterprise";
  profilePicture?: string;
}

export interface UserDetails extends UserListItem {
  country?: string;
  phoneNumber?: string;
  profilePicture?: string;
}

export interface UserStats {
  totalPosts: number;
  totalWebsites: number;
  totalChats: number;
  totalImages?: number;
}

export interface UserActivity {
  _id: string;
  userId: string;
  activityType: string;
  details: string;
  ipAddress: string;
  device: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithStats {
  user: UserDetails;
  stats: UserStats;
  loginSessions?: LoginSession[];
  activities?: UserActivity[];
  subscription?: UserSubscriptionDetails;
  usage?: AIUsageStats;
  features?: string[];
  transactions?: UserTransaction[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  users: UserListItem[];
  pagination: PaginationInfo;
}

export interface SystemHealth {
  status: string;
  services: {
    database: string;
    authService: string;
    socialMediaService: string;
    websiteBuilderService: string;
    aiContentService: string;
    chatbotService: string;
  };
  metrics: {
    requestsPerSecond: string;
    avgLatency: string;
    errorRate: string;
    uptime: number;
  };
}

export interface AnalyticsData {
  type: "daily" | "weekly" | "monthly";
  date: string;
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalPosts: number;
    totalWebsites: number;
    totalAIChats: number;
    aiRequestsCount: number;
    aiTokensUsed: number;
    aiCostEstimate: number;
    apiRequests: number;
    errorCount: number;
    avgResponseTime: number;
  };
}

// API Response Types
export interface AdminApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface UserTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "pending";
  invoiceUrl?: string;
  description: string;
}

export interface UserActivityLog {
  id: string;
  action: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  details?: string;
}

export interface LoginSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  isActive: boolean;
  location?: string;
}

export interface AIUsageStats {
  chatTokensUsed: number;
  chatTokensLimit: number;
  imageGenUsed: number;
  imageGenLimit: number;
  websiteUsed?: number;
  websiteLimit?: number;
  socialPostsUsed?: number;
  socialPostLimit?: number;
  periodStart: string;
  periodEnd: string;
}

export interface UserContentStats {
  totalChats: number;
  totalPosts: number;
  totalWebsites: number;
  totalImages: number;
}

export interface UserSubscriptionDetails {
  plan: "Free" | "Basic" | "Standard" | "Enterprise";
  status: "active" | "canceled" | "past_due";
  startDate: string;
  nextBillingDate: string;
  amount: number;
  interval: "month" | "year";
}

export interface ExtendedUserDetails extends Omit<UserDetails, "subscription"> {
  subscription: UserSubscriptionDetails;
  usage: AIUsageStats;
  contentStats: UserContentStats;
  transactions: UserTransaction[];
  activityLogs: UserActivityLog[];
  loginSessions: LoginSession[];
  features: string[];
}

// Content Log Types
export interface AIChat {
  _id: string;
  title: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
}

export interface GeneratedImage {
  _id: string;
  userId: string;
  prompt: string;
  modelUsed: string;
  imageUrl: string;
  localPath?: string;
  parameters: {
    aspectRatio?: string;
    style?: string;
    negativePrompt?: string;
  };
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  cached: boolean;
  createdAt: string;
}

export interface SocialPost {
  _id: string;
  caption: string;
  image?: {
    originalname?: string;
    mimetype?: string;
    buffer?: string;
  };
  platforms: string[];
  accounts: Array<{
    platform: string;
    name?: string;
    username?: string;
    profileImage?: string;
  }>;
  status: "scheduled" | "published" | "failed" | "cancelled";
  scheduledAt: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Website {
  _id: string;
  websiteTitle: string;
  websiteDescription?: string;
  status: number;
  publishedLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteAnalytics {
  totalWebsites: number;
  publishedWebsites: number;
  draftWebsites: number;
  totalStorageBytes: number;
  totalStorageMB: string;
  totalStorageGB: string;
  storageBreakdown: {
    galleryFiles: { count: number; sizeBytes: number; sizeMB: string };
    documents: { count: number; sizeBytes: number; sizeMB: string };
    websiteData: { count: number; sizeBytes: number; sizeMB: string };
    websitePreviews: { count: number; sizeBytes: number; sizeMB: string };
  };
  fileTypeBreakdown: {
    [key: string]: { count: number; sizeBytes: number; sizeMB: string };
  };
  websitesList: Array<{
    id: string;
    title: string;
    status: "published" | "draft";
    dataSize: number;
    hasPreview: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  lastUpdated: string;
}

export interface SingleWebsiteAnalytics {
  websiteInfo: {
    id: string;
    title: string;
    description?: string;
    status: "published" | "draft";
    publishedLink?: string;
    publishedAt?: string;
    daysPublished?: number | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
  storage: {
    totalBytes: number;
    totalMB: string;
    breakdown: {
      websiteData: { sizeBytes: number; sizeMB: string };
      documents: {
        count: number;
        sizeBytes: number;
        sizeMB: string;
        files: Array<{
          name: string;
          type: string;
          size: number;
          uploadedAt: string;
        }>;
      };
      galleryAssets: {
        count: number;
        sizeBytes: number;
        sizeMB: string;
        files: Array<{
          name: string;
          type: string;
          size: number;
          path: string;
          uploadedAt: string;
        }>;
      };
      preview: { sizeBytes: number; sizeMB: string };
    };
  };
  assets: {
    totalCount: number;
    byType: {
      [key: string]: { count: number; totalSize: number };
    };
    recentAssets: Array<{
      name: string;
      type: string;
      size: number;
      uploadedAt: string;
      source: "document" | "gallery";
      path?: string;
    }>;
  };
  pages: {
    count: number;
    list: Array<{
      name: string;
      path: string;
      sections: number;
    }>;
  };
  lastUpdated: string;
}

export interface ContentLogsResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// API Management Types
export interface APIProvider {
  id: string;
  name: 'Google Gemini' | 'OpenAI';
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'error';
  lastUpdated: string;
}

export interface APIUsageData {
  providerId: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  requestsToday: number;
  tokensToday: number;
  costToday: number;
  usageHistory: {
    date: string;
    requests: number;
    tokens: number;
    cost: number;
  }[];
}

export interface APIBalance {
  providerId: string;
  currentBalance: number;
  currency: string;
  lastChecked: string;
}

// OpenAI Detailed Usage Types
export interface OpenAIBucketResult {
  object: string;
  num_model_requests: number;
  project_id?: string;
  user_id?: string;
  api_key_id?: string;
  model?: string;
  batch?: boolean;
  service_tier?: string;
  // Completions specific
  input_tokens?: number;
  output_tokens?: number;
  input_cached_tokens?: number;
  input_audio_tokens?: number;
  output_audio_tokens?: number;
  // Images specific
  images?: number;
  size?: string;
  source?: string;
  // Audio specific
  characters?: number;
  seconds?: number;
  // Costs specific
  amount?: { value: number; currency: string; };
  line_item?: string;
}

export interface OpenAIUsageBucket {
  object: string;
  start_time: number;
  end_time: number;
  results: OpenAIBucketResult[];
}

export interface OpenAIUsagePage {
  object: string;
  data: OpenAIUsageBucket[];
  has_more: boolean;
  next_page?: string;
}

export interface OpenAIUsageBreakdown {
  source: 'openai' | 'fallback';
  timeRange: {
    start: string;
    end: string;
  };
  completions?: OpenAIUsagePage;
  images?: OpenAIUsagePage;
  costs?: OpenAIUsagePage;
  summary: {
    totalRequests: number;
    totalTokens: number;
    totalImages: number;
    totalCost: number;
    currency: string;
  };
}
