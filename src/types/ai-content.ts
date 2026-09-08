export interface ChatSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface ChatAttachment {
  filename: string;
  fileType: string;
  s3Key?: string;
  size?: number;
  extractedText?: string;
  pageCount?: number;
}

export interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date | string;
  source?: 'dataset' | 'openai';
  sources?: ChatSource[];
  attachments?: ChatAttachment[];
  edited?: boolean;
}

export interface Chat {
  _id: string;
  chatId?: string;
  title: string;
  lastMessageAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  messages?: ChatMessage[];
}

export interface ChatHistory {
  chatId: string;
  title: string;
  messages: ChatMessage[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface GenerateChatMessageRequest {
  message: string;
  chatId?: string;
  files?: File[];
  enableSearch?: boolean;
  onUploadProgress?: (percent: number) => void;
}

export interface GenerateChatMessageResponse {
  success: boolean;
  message?: string;
  data?: {
    chatId: string;
    chatTitle: string;
    followUps?: string[];
    messages: ChatMessage[];
  };
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface RegenerateMessageResponse {
  success: boolean;
  message?: string;
  data?: {
    chatId: string;
    chatTitle: string;
    followUps?: string[];
    message: ChatMessage;
  };
}

export interface GetUserChatsResponse {
  success: boolean;
  message?: string;
  data?: Chat[];
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface GetChatHistoryResponse {
  success: boolean;
  message?: string;
  data?: ChatHistory;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface DeleteChatResponse {
  success: boolean;
  message?: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface UpdateChatTitleRequest {
  title: string;
}

export interface UpdateChatTitleResponse {
  success: boolean;
  message?: string;
  data?: {
    chatId: string;
    title: string;
  };
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface Memory {
  _id: string;
  userId: string;
  content: string;
  source: 'manual' | 'chat';
  sourceChatId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MemoryResponse {
  success: boolean;
  message?: string;
  data?: Memory;
}

export interface MemoryListResponse {
  success: boolean;
  message?: string;
  data?: Memory[];
}
