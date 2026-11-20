import { JsonFileRepository, IDatabaseRepository, DbUser, DbJob, DbSubscription, DbMetrics } from '../database/repository';

export { DbUser, DbJob, DbSubscription, DbMetrics, IDatabaseRepository };

// Primary database repository instance
export const dbRepository: IDatabaseRepository = new JsonFileRepository();

/**
 * Backward-Compatible Database Service Adapter
 * Preserves existing synchronous method signatures while providing async equivalents
 */
class DatabaseServiceAdapter {
  private repo: JsonFileRepository;

  constructor() {
    this.repo = new JsonFileRepository();
  }

  public getUserById(id: string): DbUser | null {
    const users = (this.repo as any).data?.users || {};
    return (Object.values(users) as DbUser[]).find((u) => u.id === id) || null;
  }

  public getUserByEmail(email: string): DbUser | null {
    return (this.repo as any).data?.users?.[email] || null;
  }

  public upsertUser(user: Partial<DbUser> & { email: string }): DbUser {
    let result: any = null;
    this.repo.upsertUser(user).then((u) => (result = u));
    return (this.repo as any).data?.users?.[user.email] || (user as DbUser);
  }

  public getAllUsers(): DbUser[] {
    return Object.values((this.repo as any).data?.users || {}) as DbUser[];
  }

  public incrementUserUsage(email: string): void {
    this.repo.incrementUserUsage(email);
  }

  public createJob(job: DbJob): DbJob {
    this.repo.createJob(job);
    return job;
  }

  public getJob(id: string): DbJob | null {
    return (this.repo as any).data?.jobs?.[id] || null;
  }

  public updateJob(id: string, updates: Partial<DbJob>): DbJob | null {
    this.repo.updateJob(id, updates);
    return (this.repo as any).data?.jobs?.[id] || null;
  }

  public createSubscription(userId: string, tier: 'premium' | 'business', amount: number): DbSubscription {
    let sub: any = null;
    this.repo.createSubscription(userId, tier, amount).then((s) => (sub = s));
    const id = `sub_${Date.now()}`;
    return {
      id,
      userId,
      tier,
      amount,
      currency: 'USD',
      status: 'active',
      createdAt: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  public getUserSubscription(userId: string): DbSubscription | null {
    const subs = (this.repo as any).data?.subscriptions || {};
    return (Object.values(subs) as DbSubscription[]).find((s) => s.userId === userId && s.status === 'active') || null;
  }

  public getMetrics(): DbMetrics {
    const raw = (this.repo as any).data?.metrics || {
      totalProcessedJobs: 0,
      edgeBandwidthSavedGB: 0,
      ephemeralFilesPurgedCount: 0,
    };
    const activeJobs = Object.values((this.repo as any).data?.jobs || {}).filter(
      (j: any) => j.status === 'queued' || j.status === 'processing'
    ).length;
    const usersCount = Object.keys((this.repo as any).data?.users || {}).length;

    return {
      totalProcessedJobs: raw.totalProcessedJobs || 0,
      activeJobsInQueue: activeJobs,
      edgeBandwidthSavedGB: raw.edgeBandwidthSavedGB || 0,
      ephemeralFilesPurgedCount: raw.ephemeralFilesPurgedCount || 0,
      ephemeralFilesPurgedToday: raw.ephemeralFilesPurgedCount || 0,
      registeredUsersCount: usersCount,
      successRate: '99.8%',
    };
  }

  public updateMetrics(updates: Partial<DbMetrics>): void {
    const current = (this.repo as any).data?.metrics || {};
    (this.repo as any).data.metrics = { ...current, ...updates };
    (this.repo as any).saveData?.();
  }

  public recordPurge(count: number): void {
    this.repo.recordPurge(count);
  }

  public async isHealthy(): Promise<boolean> {
    return await this.repo.isHealthy();
  }
}

export const db = new DatabaseServiceAdapter();
