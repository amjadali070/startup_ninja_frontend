export interface EnhanceWithAIRequest {
  content: string;
  platforms?: string[];
}

export interface EnhanceWithAIResponse {
  success: boolean;
  message?: string;
  data?: {
    originalContent: string;
    enhancedContent: string;
  };
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface WriteWithAIRequest {
  prompt: string;
  platforms?: string[];
}

export interface WriteWithAIResponse {
  success: boolean;
  message?: string;
  data?: {
    generatedContent: string;
  };
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

