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
  icon: string;
  badge?: 'Popular' | 'New' | 'Pro' | 'AI';
  isClientSide: boolean;
  acceptedFileTypes: string[];
  maxFilesFree: number;
  maxFileSizeFreeMB: number;
  seoTitle: string;
  seoKeywords: string[];
  howToSteps: string[];
}

export type JobStatus =
  | 'idle'
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'error';

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl?: string;
  pageCount?: number;
  rotation?: number; // 0, 90, 180, 270
}

export interface ProcessingResult {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  originalTotalSize: number;
  savedPercentage?: number;
  pageCount?: number;
}
