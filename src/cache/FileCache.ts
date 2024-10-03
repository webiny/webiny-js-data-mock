import path from "path";
import { ICache, ICacheKey, ICacheKeyInput } from "./types";
import { logger } from "~/logger";
import fsExtra from "fs-extra";
import { createCacheKey } from "~/cache/CacheKey";

export interface IFileCacheParams {
    cacheDir?: string;
    ttl?: number;
}

const defaultCacheDir = "./.cache/";

class FileCache implements ICache {
    private readonly ttl: number = 0;
    private cacheDir: string;
    private disabled: boolean = false;

    private keys: ICacheKey[] = [];

    // Prevent direct instantiation.
    protected constructor(params?: IFileCacheParams) {
        this.cacheDir = params?.cacheDir || defaultCacheDir;
        this.ttl = params?.ttl || 300;

        this.clearExisting();
    }

    public static create(params?: IFileCacheParams) {
        return new this(params);
    }

    public setCacheDir(cacheDir: string): void {
        this.cacheDir = cacheDir;
    }

    public disable(): void {
        this.disabled = true;
    }

    public enable(): void {
        this.disabled = false;
    }

    public get<T>(input: ICacheKeyInput): T | null {
        if (this.disabled) {
            return null;
        }
        const cacheKey = createCacheKey(input);
        return this.read<T>(cacheKey);
    }

    public set<T>(input: ICacheKeyInput, value: T): T {
        const cacheKey = createCacheKey(input);
        this.write<T>(cacheKey, value);
        return value;
    }

    public async getOrSet<T>(input: ICacheKeyInput, cb: () => Promise<T>): Promise<T> {
        const cacheKey = createCacheKey(input);
        const existing = this.get<T>(cacheKey);
        if (existing) {
            return existing;
        }
        const value = await cb();
        return this.set<T>(cacheKey, value);
    }

    public clear(cacheKey?: ICacheKeyInput) {
        if (!cacheKey) {
            cacheKey = this.keys;
        }
        if (Array.isArray(cacheKey)) {
            for (const key of cacheKey) {
                this.delete(key);
            }
            return;
        }

        this.delete(cacheKey);
    }

    private read<T>(input: ICacheKeyInput): T | null {
        const cacheKey = createCacheKey(input);
        this.addKey(cacheKey);
        try {
            const target = this.createPath(cacheKey);
            if (!fsExtra.existsSync(target)) {
                return null;
            }
            const stats = fsExtra.statSync(target);
            if (this.isExpired(stats)) {
                return null;
            }
            const content = fsExtra.readFileSync(target, "utf8");
            if (!content) {
                return null;
            }
            return JSON.parse(content) as T;
        } catch (ex) {
            logger.error(ex);
            return null;
        }
    }

    private write<T>(input: ICacheKeyInput, data: T): void {
        const cacheKey = createCacheKey(input);
        this.addKey(cacheKey);
        try {
            const target = this.createPath(cacheKey);

            fsExtra.ensureDirSync(path.dirname(target));

            fsExtra.writeFileSync(target, JSON.stringify(data, null, 2));
        } catch (ex) {
            logger.error(ex);
        }
    }

    private delete(input: ICacheKeyInput): void {
        const cacheKey = createCacheKey(input);
        this.addKey(cacheKey);
        try {
            fsExtra.unlinkSync(this.createPath(cacheKey));
        } catch (ex) {
            logger.error(ex);
        }
    }

    private createPath(input: ICacheKeyInput): string {
        const cacheKey = createCacheKey(input);
        return path.join(this.cacheDir, `${cacheKey.get()}.json`);
    }

    private addKey(input: ICacheKeyInput): void {
        const cacheKey = createCacheKey(input);

        for (const key of this.keys) {
            if (key.get() === cacheKey.get()) {
                return;
            }
        }
        this.keys.push(cacheKey);
    }

    private clearExisting(): void {
        if (!fsExtra.existsSync(this.cacheDir)) {
            return;
        }
        const files = fsExtra.readdirSync(this.cacheDir);
        for (const file of files) {
            const target = path.join(this.cacheDir, file);
            const stats = fsExtra.statSync(target);
            if (!this.isExpired(stats)) {
                continue;
            }
            fsExtra.unlinkSync(target);
        }
    }

    private isExpired(stats: fsExtra.Stats): boolean {
        return stats.mtime < new Date(Date.now() - this.ttl * 1000);
    }
}

export type { FileCache };

export const createFileCache = (params?: IFileCacheParams): ICache => {
    return FileCache.create(params);
};
