// SimplePDF Shared Types

export type ToolCategory =
  | 'organize'
  | 'optimize'
  | 'convert-to'
  | 'convert-from'
  | 'edit'
  | 'security'
  | 'intelligence';

export interface ToolMeta {
  id: string;
  name: string;
  shortName?: string;
  category: ToolCategory;
  description: string;
  longDescription: string;
  path: string;
  icon: string; // Lucide icon identifier
  badge?: 'Popular' | 'New' | 'Pro' | 'AI';
  isClientSide: boolean;
  acceptedFileTypes: string[];
  maxFilesFree: number;
  maxFileSizeFreeMB: number;
  seoTitle: string;
  seoKeywords: string[];
}

export type JobStatus =
  | 'idle'
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'error'
  | 'canceled';

export interface ProcessingJob {
  id: string;
  toolId: string;
  status: JobStatus;
  progress: number; // 0 - 100
  statusMessage?: string;
  originalFiles: {
    name: string;
    size: number;
    type: string;
  }[];
  result?: {
    downloadUrl: string;
    fileName: string;
    fileSize: number;
    expiresAt: string;
    pageCount?: number;
    compressionRatio?: number;
  };
  error?: string;
  createdAt: string;
}

export type UserTier = 'free' | 'premium' | 'business';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  tier: UserTier;
  createdAt: string;
  usageToday: {
    tasksCount: number;
    bytesProcessed: number;
  };
}

export interface PlanFeature {
  name: string;
  free: string | boolean;
  premium: string | boolean;
  business: string | boolean;
}
