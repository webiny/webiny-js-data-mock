import path from "path";
import { ICache, ICacheKey } from "./types";
import { logger } from "~/logger";
import fsExtra from "fs-extra";

export interface IFileCacheParams {
    cacheDir?: string;
}

const defaultCacheDir = "./cache/";

class FileCache implements ICache {
    private cacheDir: string = "./cache/";
    private disabled: boolean = false;

    protected constructor(params?: IFileCacheParams) {
        // Prevent direct instantiation.
        this.cacheDir = params?.cacheDir || defaultCacheDir;
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

    public clear(cacheKey: ICacheKey | ICacheKey[]) {
        if (Array.isArray(cacheKey)) {
            for (const key of cacheKey) {
                this.delete(key);
            }
            return;
        }

        this.delete(cacheKey);
    }

    private read<T>(key: ICacheKey): T | null {
        try {
            const target = this.createPath(key);

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
        try {
            const target = this.createPath(key);
            fsExtra.writeFileSync(target, JSON.stringify(data, null, 2));
        } catch (ex) {
            logger.error(ex);
        }
    }

    private delete(key: ICacheKey): void {
        try {
            fsExtra.unlinkSync(this.createPath(key));
        } catch (ex) {
            logger.error(ex);
        }
    }

    private createPath(key: ICacheKey): string {
        return path.join(this.cacheDir, `${key.get()}.json`);
    }
}

export type { FileCache };

export const createFileCache = (params?: IFileCacheParams): ICache => {
    return FileCache.create(params);
};
