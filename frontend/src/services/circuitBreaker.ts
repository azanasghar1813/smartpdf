/**
 * Enterprise Circuit Breaker Pattern for SimplePDF
 * Provides resilience against backend downtime, latency spikes, and network partitions.
 * Seamlessly triggers in-browser client fallback when backend clusters fail.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number;     // Number of consecutive failures before opening
  cooldownPeriodMs?: number;     // Time to wait before attempting recovery (half-open)
  requestTimeoutMs?: number;     // Max time allowed for a single cloud request
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly cooldownPeriodMs: number;
  private readonly requestTimeoutMs: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.cooldownPeriodMs = options.cooldownPeriodMs ?? 20000; // 20s cooldown
    this.requestTimeoutMs = options.requestTimeoutMs ?? 15000; // 15s timeout
  }

  public getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownPeriodMs) {
        this.state = 'HALF_OPEN';
      }
    }
    return this.state;
  }

  public async execute<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      console.warn('[CircuitBreaker] Circuit is OPEN. Bypassing cloud cluster and executing client fallback.');
      return await fallback();
    }

    try {
      // Execute cloud action with timeout race
      const result = await Promise.race([
        action(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Cloud cluster request timed out')), this.requestTimeoutMs)
        ),
      ]);

      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      console.warn('[CircuitBreaker] Cloud cluster failed. Engaging client fallback engine:', err);
      return await fallback();
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(err: any) {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      console.error(
        `[CircuitBreaker] Circuit Tripped to OPEN! (${this.failureCount} consecutive failures). Activating fallback mode.`
      );
    }
  }

  public reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

// Global shared circuit breaker instance for SimplePDF Cloud Operations
export const cloudCircuitBreaker = new CircuitBreaker();
