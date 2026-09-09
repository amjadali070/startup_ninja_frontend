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

export interface RepurposeVariants {
  instagram: string;
  facebook: string;
  linkedin: string;
  shortForm: string;
  reelScript: string;
  blog: string;
}

export interface RepurposeWithAIRequest {
  input: string;
}

export interface RepurposeWithAIResponse {
  success: boolean;
  message?: string;
  data?: { variants: RepurposeVariants };
}

export interface BrandVoice {
  businessName?: string;
  industry?: string;
  description?: string;
  tone?: string;
  targetAudience?: string;
  keywords?: string[];
}

export interface BrandVoiceResponse {
  success: boolean;
  message?: string;
  data?: BrandVoice | null;
}

