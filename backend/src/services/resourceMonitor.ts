import os from 'os';
import { config } from '../config/env';

export interface ResourceMetrics {
  cpuUsagePercent: number;
  freeMemBytes: number;
  totalMemBytes: number;
  freeMemPercent: number;
  processMemBytes: number;
  isOverloaded: boolean;
  recommendedConcurrency: number;
}

export class ResourceMonitor {
  private baseConcurrency: number;
  private maxMemoryThresholdPercent: number; // e.g., keep at least 15% RAM free
  private maxCpuThresholdPercent: number; // e.g. 85% CPU load

  constructor() {
    this.baseConcurrency = config.queue.concurrency || 4;
    this.maxMemoryThresholdPercent = 15; // Alert if free memory < 15%
    this.maxCpuThresholdPercent = 85;
  }

  public getSystemMetrics(): ResourceMetrics {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const freeMemPercent = Math.round((freeMem / totalMem) * 100);
    const processMem = process.memoryUsage().rss;

    // CPU load average (1-minute load average on POSIX, approximate via os.cpus() on Windows)
    let cpuPercent = 0;
    const loadAvg = os.loadavg();
    if (loadAvg && loadAvg[0] !== undefined && loadAvg[0] > 0) {
      cpuPercent = Math.min(100, Math.round((loadAvg[0] / os.cpus().length) * 100));
    } else {
      // Sample CPU times
      const cpus = os.cpus();
      let totalTick = 0;
      let idleTick = 0;
      cpus.forEach((cpu) => {
        for (const type in cpu.times) {
          totalTick += (cpu.times as any)[type];
        }
        idleTick += cpu.times.idle;
      });
      cpuPercent = Math.round(100 - (idleTick / totalTick) * 100) || 10;
    }

    const isMemConstrained = freeMemPercent < this.maxMemoryThresholdPercent;
    const isCpuConstrained = cpuPercent > this.maxCpuThresholdPercent;
    const isOverloaded = isMemConstrained || isCpuConstrained;

    // Dynamically throttle concurrency if resources are under heavy pressure
    let recommendedConcurrency = this.baseConcurrency;
    if (isMemConstrained && freeMemPercent < 5) {
      recommendedConcurrency = 1; // Critical memory: strictly 1 job at a time
    } else if (isOverloaded) {
      recommendedConcurrency = Math.max(1, Math.floor(this.baseConcurrency / 2));
    }

    return {
      cpuUsagePercent: cpuPercent,
      totalMemBytes: totalMem,
      freeMemBytes: freeMem,
      freeMemPercent,
      processMemBytes: processMem,
      isOverloaded,
      recommendedConcurrency,
    };
  }

  public canAcceptNewJob(): boolean {
    const metrics = this.getSystemMetrics();
    // Refuse or backoff if free memory is less than 5% or process memory exceeds 1.5GB
    if (metrics.freeMemPercent < 5 || metrics.processMemBytes > 1.5 * 1024 * 1024 * 1024) {
      return false;
    }
    return true;
  }
}

export const resourceMonitor = new ResourceMonitor();
