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
}

export interface UserWithStats {
  user: UserDetails;
  stats: UserStats;
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
  plan: "Free" | "Basic" | "Pro" | "Enterprise";
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

export interface ContentLogsResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
