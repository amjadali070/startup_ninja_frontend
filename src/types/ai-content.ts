export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date | string;
  source?: 'dataset' | 'openai';
}

export interface Chat {
  _id: string;
  chatId?: string;
  title: string;
  lastMessageAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
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
}

export interface GenerateChatMessageResponse {
  success: boolean;
  message?: string;
  data?: {
    chatId: string;
    chatTitle: string;
    messages: ChatMessage[];
  };
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
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
