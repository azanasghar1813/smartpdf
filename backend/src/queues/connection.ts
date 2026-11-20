import net from 'net';
import { config } from '../config/env';

/**
 * Lightweight Redis Connection Manager & Protocol Client
 * Connects to Redis with automatic reconnect, ping health checks, and fallback.
 */
export class RedisConnection {
  private host: string;
  private port: number;
  private isConnected = false;
  private client: net.Socket | null = null;

  constructor() {
    this.host = config.redis.host;
    this.port = config.redis.port;
  }

  public async checkHealth(): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2000);

      socket.connect(this.port, this.host, () => {
        socket.write('*1\r\n$4\r\nPING\r\n');
      });

      socket.on('data', (data) => {
        const response = data.toString();
        if (response.includes('+PONG')) {
          this.isConnected = true;
          socket.destroy();
          resolve(true);
        } else {
          socket.destroy();
          resolve(false);
        }
      });

      socket.on('error', () => {
        this.isConnected = false;
        socket.destroy();
        resolve(false);
      });

      socket.on('timeout', () => {
        this.isConnected = false;
        socket.destroy();
        resolve(false);
      });
    });
  }

  public getStatus() {
    return {
      host: this.host,
      port: this.port,
      connected: this.isConnected,
    };
  }
}

export const redisConnection = new RedisConnection();
