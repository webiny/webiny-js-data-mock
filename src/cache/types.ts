import { ICacheKeyKeys } from "@webiny/utils";

export { ICacheKeyKeys };

export interface ICacheKey {
    get(): string;
    keys: ICacheKeyKeys;
}

export interface ICache {
    disable(): void;
    enable(): void;
    setCacheDir(cacheDir: string): void;
    get<T>(cacheKey: ICacheKey): T | null;
    set<T>(cacheKey: ICacheKey, value: T): T;
    getOrSet<T>(cacheKey: ICacheKey, cb: () => Promise<T>): Promise<T>;
    clear(cacheKey?: ICacheKey | ICacheKey[]): void;
}
