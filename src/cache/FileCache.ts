import path from "path";
import { ICache, ICacheKey } from "./types";
import { logger } from "~/logger";
import fsExtra from "fs-extra";

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

    public get<T>(cacheKey: ICacheKey): T | null {
        if (this.disabled) {
            return null;
        }
        const value = this.read<T>(cacheKey);
        return value || null;
    }

    public set<T>(cacheKey: ICacheKey, value: T): T {
        this.write<T>(cacheKey, value);
        return value;
    }

    public async getOrSet<T>(cacheKey: ICacheKey, cb: () => Promise<T>): Promise<T> {
        const existing = this.get<T>(cacheKey);
        if (existing) {
            return existing;
        }
        const value = await cb();
        return this.set<T>(cacheKey, value);
    }

    public clear(cacheKey?: ICacheKey | ICacheKey[]) {
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

    private read<T>(key: ICacheKey): T | null {
        this.addKey(key);
        try {
            const target = this.createPath(key);
            if (!fsExtra.existsSync(target)) {
                return null;
            }
            const stats = fsExtra.statSync(target);
            if (stats.mtime < new Date(Date.now() - this.ttl * 1000)) {
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

    private write<T>(key: ICacheKey, data: T): void {
        this.addKey(key);
        try {
            const target = this.createPath(key);

            fsExtra.ensureDirSync(path.dirname(target));

            fsExtra.writeFileSync(target, JSON.stringify(data, null, 2));
        } catch (ex) {
            logger.error(ex);
        }
    }

    private delete(key: ICacheKey): void {
        this.addKey(key);
        try {
            fsExtra.unlinkSync(this.createPath(key));
        } catch (ex) {
            logger.error(ex);
        }
    }

    private createPath(key: ICacheKey): string {
        return path.join(this.cacheDir, `${key.get()}.json`);
    }

    private addKey(input: ICacheKey): void {
        for (const key of this.keys) {
            if (key.get() === input.get()) {
                return;
            }
        }
        this.keys.push(input);
    }
}

export type { FileCache };

export const createFileCache = (params?: IFileCacheParams): ICache => {
    return FileCache.create(params);
};
