const getBackendUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.origin.includes('simplepdf.me')) {
    return '';
  }
  return (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
};
const BACKEND_URL = getBackendUrl();
const API_BASE = `${BACKEND_URL}/api/v1`;

export interface ApiJobStatus {
  id: string;
  toolId: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  fileName: string;
  fileSize: number;
  resultFileName?: string;
  downloadUrl?: string;
  error?: string;
}

export class ApiService {
  /**
   * Check if backend API server is healthy and accessible
   */
  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch live platform metrics for admin dashboard
   */
  public static async getMetrics() {
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[ApiService] Backend metrics unreachable, using edge estimates.');
    }
    return {
      totalProcessedJobs: 0,
      activeJobsInQueue: 0,
      edgeBandwidthSavedGB: 0,
      ephemeralFilesPurgedToday: 0,
      registeredUsersCount: 1,
      successRate: '100%',
    };
  }

  /**
   * Upload file and poll background processing pipeline
   */
  public static async uploadAndProcessJob(
    file: File,
    toolId: string,
    options: Record<string, any> = {},
    onProgress?: (progress: number, message: string) => void
  ): Promise<{ blob: Blob; fileName: string }> {
    onProgress?.(15, 'Uploading document to secure processing pipeline...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('toolId', toolId);
    formData.append('options', JSON.stringify(options));

    const savedUser = localStorage.getItem('simplepdf_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        formData.append('userEmail', u.email);
      } catch (_) {}
    }

    // 1. Submit Job
    const createRes = await fetch(`${API_BASE}/jobs/create`, {
      method: 'POST',
      body: formData,
    });

    if (!createRes.ok) {
      throw new Error(`Upload failed with server status ${createRes.status}`);
    }

    const { jobId } = await createRes.json();
    onProgress?.(35, 'Document enqueued in high-speed cloud cluster...');

    // 2. Poll Status
    let attempts = 0;
    while (attempts < 60) {
      await new Promise((r) => setTimeout(r, 800));
      attempts++;

      const statusRes = await fetch(`${API_BASE}/jobs/${jobId}/status`);
      if (!statusRes.ok) continue;

      const jobData: ApiJobStatus = await statusRes.json();
      onProgress?.(
        Math.min(95, Math.max(35, jobData.progress)),
        jobData.status === 'processing'
          ? 'Converting and applying structural formatting...'
          : 'Finalizing document...'
      );

      if (jobData.status === 'completed') {
        onProgress?.(98, 'Preparing download stream...');
        const dlRes = await fetch(`${BACKEND_URL}${jobData.downloadUrl}`);
        if (!dlRes.ok) {
          throw new Error('Failed to stream converted document from cloud storage.');
        }
        const blob = await dlRes.blob();
        return {
          blob,
          fileName: jobData.resultFileName || `SimplePDF_${toolId}.pdf`,
        };
      }

      if (jobData.status === 'error') {
        throw new Error(jobData.error || 'Server conversion pipeline encountered an issue.');
      }
    }

    throw new Error('Conversion timed out after 60 seconds.');
  }

  /**
   * AI Summarization API
   */
  public static async summarizeText(text: string, depth: 'quick' | 'detailed' | 'academic' = 'detailed') {
    const res = await fetch(`${API_BASE}/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, depth }),
    });

    if (!res.ok) {
      throw new Error('AI Summarizer service temporarily unavailable');
    }
    const data = await res.json();
    return data.data;
  }

  /**
   * AI Translation API
   */
  public static async translateText(text: string, targetLang: string) {
    const res = await fetch(`${API_BASE}/ai/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });

    if (!res.ok) {
      throw new Error('AI Translation service temporarily unavailable');
    }
    const data = await res.json();
    return data.data;
  }

  /**
   * AI Compare API
   */
  public static async compareDocuments(doc1: string, doc2: string) {
    const res = await fetch(`${API_BASE}/ai/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc1, doc2 }),
    });

    if (!res.ok) {
      throw new Error('AI Document comparison temporarily unavailable');
    }
    const data = await res.json();
    return data.data;
  }

  /**
   * Payment & Pro Upgrade API
   */
  public static async upgradeTier(userId: string, tier: 'premium' | 'business') {
    const res = await fetch(`${API_BASE}/payment/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tier }),
    });

    if (!res.ok) {
      throw new Error('Payment confirmation failed');
    }
    return await res.json();
  }

  /**
   * User Auth API
   */
  public static async loginUser(email: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  }

  public static async registerUser(name: string, email: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return await res.json();
  }

  public static async getAllUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/users`);
      if (res.ok) {
        const data = await res.json();
        return data.users || [];
      }
    } catch {
      // Return empty if backend unreachable
    }
    return [];
  }

  /**
   * Admin: Trigger manual purge of expired files on server
   */
  public static async purgeExpiredStorage(): Promise<{ success: boolean; purgedCount: number }> {
    try {
      const res = await fetch(`${API_BASE}/admin/purge-storage`, { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return { success: false, purgedCount: 0 };
  }

  /**
   * Get server health details
   */
  public static async getHealthDetails() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return null;
  }

  /**
   * Get server ready probe
   */
  public static async getReadyDetails() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/ready`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return null;
  }
}
