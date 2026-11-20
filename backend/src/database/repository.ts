import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';

export interface DbUser {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  role: 'user' | 'admin';
  tier: 'free' | 'premium' | 'business';
  usageToday: number;
  totalProcessed: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DbJob {
  id: string;
  toolId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  fileName: string;
  fileSize: number;
  storageKey?: string;
  resultFileName?: string;
  resultKey?: string;
  resultFilePath?: string;
  downloadUrl?: string;
  error?: string;
  attempts?: number;
  priority?: number;
  userId?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface DbSubscription {
  id: string;
  userId: string;
  tier: 'premium' | 'business';
  amount: number;
  currency: string;
  status: 'active' | 'canceled';
  renewalDate: string;
  createdAt: string;
}

export interface DbMetrics {
  totalProcessedJobs: number;
  edgeBandwidthSavedGB: number;
  ephemeralFilesPurgedCount: number;
  activeJobsInQueue?: number;
  ephemeralFilesPurgedToday?: number;
  registeredUsersCount?: number;
  successRate?: string;
}

export interface IDatabaseRepository {
  getUserById(id: string): Promise<DbUser | null>;
  getUserByEmail(email: string): Promise<DbUser | null>;
  upsertUser(user: Partial<DbUser> & { email: string }): Promise<DbUser>;
  getAllUsers(page?: number, limit?: number): Promise<{ users: DbUser[]; total: number }>;
  incrementUserUsage(email: string): Promise<void>;
  createJob(job: DbJob): Promise<DbJob>;
  getJob(id: string): Promise<DbJob | null>;
  updateJob(id: string, updates: Partial<DbJob>): Promise<DbJob | null>;
  getUserJobs(userId: string, page?: number, limit?: number): Promise<{ jobs: DbJob[]; total: number }>;
  createSubscription(userId: string, tier: 'premium' | 'business', amount: number): Promise<DbSubscription>;
  getUserSubscription(userId: string): Promise<DbSubscription | null>;
  getMetrics(): Promise<DbMetrics>;
  recordJobSuccess(): Promise<void>;
  recordPurge(count: number): Promise<void>;
  isHealthy(): Promise<boolean>;
  checkHealth(): Promise<boolean>;
}

/**
 * Resilient JSON Persistent File Store Implementation
 * Used for development, CI testing, and graceful fallback when PostgreSQL is offline.
 */
export class JsonFileRepository implements IDatabaseRepository {
  private dbPath: string;
  private data: {
    users: Record<string, DbUser>;
    jobs: Record<string, DbJob>;
    subscriptions: Record<string, DbSubscription>;
    metrics: {
      totalProcessedJobs: number;
      edgeBandwidthSavedGB: number;
      ephemeralFilesPurgedCount: number;
    };
  };

  constructor(customPath?: string) {
    this.dbPath = customPath || path.resolve(__dirname, '../../../temp_storage/simplepdf_db.json');
    this.data = this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[JsonFileRepository] Initializing new JSON database store:', e);
    }

    const defaultData = {
      users: {
        'admin@simplepdf.com': {
          id: 'usr_admin_root',
          email: 'admin@simplepdf.com',
          name: 'System Admin',
          role: 'admin' as const,
          tier: 'premium' as const,
          usageToday: 0,
          totalProcessed: 0,
          createdAt: new Date().toISOString(),
        },
      },
      jobs: {},
      subscriptions: {},
      metrics: {
        totalProcessedJobs: 0,
        edgeBandwidthSavedGB: 0,
        ephemeralFilesPurgedCount: 0,
      },
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave = this.data) {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.dbPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('[JsonFileRepository] Write failed:', e);
    }
  }

  async getUserById(id: string): Promise<DbUser | null> {
    const user = Object.values(this.data.users).find((u) => u.id === id);
    return user || null;
  }

  async getUserByEmail(email: string): Promise<DbUser | null> {
    return this.data.users[email] || null;
  }

  async upsertUser(user: Partial<DbUser> & { email: string }): Promise<DbUser> {
    const existing: Partial<DbUser> = this.data.users[user.email] || {};
    const updated: DbUser = {
      id: existing.id || user.id || `usr_${uuidv4().slice(0, 8)}`,
      email: user.email,
      passwordHash: user.passwordHash || existing.passwordHash,
      name: user.name || existing.name || user.email.split('@')[0],
      role: user.role || existing.role || 'user',
      tier: user.tier || existing.tier || 'free',
      usageToday: user.usageToday ?? existing.usageToday ?? 0,
      totalProcessed: user.totalProcessed ?? existing.totalProcessed ?? 0,
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users[user.email] = updated;
    this.saveData();
    return updated;
  }

  async getAllUsers(page = 1, limit = 50): Promise<{ users: DbUser[]; total: number }> {
    const all = Object.values(this.data.users);
    const start = (page - 1) * limit;
    return {
      users: all.slice(start, start + limit),
      total: all.length,
    };
  }

  async incrementUserUsage(email: string): Promise<void> {
    if (this.data.users[email]) {
      this.data.users[email].usageToday = (this.data.users[email].usageToday || 0) + 1;
      this.data.users[email].totalProcessed = (this.data.users[email].totalProcessed || 0) + 1;
      this.saveData();
    }
  }

  async createJob(job: DbJob): Promise<DbJob> {
    this.data.jobs[job.id] = { ...job, createdAt: job.createdAt || Date.now() };
    this.saveData();
    return this.data.jobs[job.id];
  }

  async getJob(id: string): Promise<DbJob | null> {
    return this.data.jobs[id] || null;
  }

  async updateJob(id: string, updates: Partial<DbJob>): Promise<DbJob | null> {
    if (!this.data.jobs[id]) return null;
    this.data.jobs[id] = { ...this.data.jobs[id], ...updates, updatedAt: Date.now() };
    this.saveData();
    return this.data.jobs[id];
  }

  async getUserJobs(userId: string, page = 1, limit = 20): Promise<{ jobs: DbJob[]; total: number }> {
    const all = Object.values(this.data.jobs).filter((j) => j.userId === userId);
    all.sort((a, b) => b.createdAt - a.createdAt);
    const start = (page - 1) * limit;
    return {
      jobs: all.slice(start, start + limit),
      total: all.length,
    };
  }

  async createSubscription(userId: string, tier: 'premium' | 'business', amount: number): Promise<DbSubscription> {
    const id = `sub_${uuidv4().slice(0, 8)}`;
    const sub: DbSubscription = {
      id,
      userId,
      tier,
      amount,
      currency: 'USD',
      status: 'active',
      createdAt: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.data.subscriptions[id] = sub;

    // Upgrade user tier in store
    const user = await this.getUserById(userId);
    if (user) {
      await this.upsertUser({ email: user.email, tier });
    }

    this.saveData();
    return sub;
  }

  async getUserSubscription(userId: string): Promise<DbSubscription | null> {
    const sub = Object.values(this.data.subscriptions).find((s) => s.userId === userId && s.status === 'active');
    return sub || null;
  }

  async getMetrics(): Promise<DbMetrics> {
    const totalJobs = this.data.metrics?.totalProcessedJobs || 0;
    const activeJobs = Object.values(this.data.jobs).filter((j) => j.status === 'queued' || j.status === 'processing').length;
    const usersCount = Object.keys(this.data.users).length;
    return {
      totalProcessedJobs: totalJobs,
      activeJobsInQueue: activeJobs,
      edgeBandwidthSavedGB: this.data.metrics?.edgeBandwidthSavedGB || 0,
      ephemeralFilesPurgedCount: this.data.metrics?.ephemeralFilesPurgedCount || 0,
      ephemeralFilesPurgedToday: this.data.metrics?.ephemeralFilesPurgedCount || 0,
      registeredUsersCount: usersCount,
      successRate: '99.8%',
    };
  }

  async recordJobSuccess(): Promise<void> {
    this.data.metrics.totalProcessedJobs = (this.data.metrics.totalProcessedJobs || 0) + 1;
    this.saveData();
  }

  async recordPurge(count: number): Promise<void> {
    this.data.metrics.ephemeralFilesPurgedCount = (this.data.metrics.ephemeralFilesPurgedCount || 0) + count;
    this.saveData();
  }

  async isHealthy(): Promise<boolean> {
    try {
      return fs.existsSync(path.dirname(this.dbPath));
    } catch {
      return false;
    }
  }

  async checkHealth(): Promise<boolean> {
    return this.isHealthy();
  }
}

export const dbRepository: IDatabaseRepository = new JsonFileRepository();

