import { createClient } from 'redis';
import { getLogger } from './logger';

export type RedisClient = ReturnType<typeof createClient>;

const LOGGER = getLogger('CACHE');

export class Cache {
  private readonly TTL = 3600; // 60min

  constructor(private readonly cacheClient: RedisClient) {
    cacheClient.on('connect', () => {
      LOGGER.info(`Redis connection established`);
    });

    cacheClient.on('error', (err) => {
      LOGGER.error(err);
    });

    cacheClient.connect();
  }

  async cacheProxy<T>(proxiedResource: () => Promise<T>, key: string): Promise<T> {
    if (!this.cacheClient.isReady) {
      return await proxiedResource();
    }

    const cacheResult = await this.cacheClient.get(key);
    if (cacheResult) {
      return JSON.parse(cacheResult);
    }

    const proxyResult = await proxiedResource();
    this.cacheClient.setEx(key, this.TTL, JSON.stringify(proxyResult));
    return proxyResult;
  }
}
