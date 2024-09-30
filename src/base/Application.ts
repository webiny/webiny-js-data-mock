import dotenv from "dotenv";
import { IBaseApplication } from "~/types";
import { GroupApplication } from "~/apps/GroupApplication";
import { ModelApplication } from "~/apps/ModelApplication";
import { EntryApplication } from "~/apps/EntryApplication";
import { GraphQLApplication } from "~/apps/GraphQLApplication";
import { FetchEntriesApplication } from "~/apps/FetchEntriesApplication";
import { TenantsApplication } from "~/apps/tenants/TenantsApplication";
import { EntryPerTenantApplication } from "~/apps/tenants/EntryPerTenantApplication";
// import { PageApplication } from "~/apps/PageApplication";
// import { FolderApplication } from "~/apps/FolderApplication";

const getEnv = () => {
    dotenv.config();
    const url = process.env.API_GRAPHQL_URL;
    if (!url) {
        throw new Error("URL is not defined.");
    }
    const token = process.env.API_TOKEN;
    if (!token) {
        throw new Error("Token is not defined.");
    }
    return {
        url,
        token
    };
};

export interface ApplicationParams {
    confirm?: boolean;
    tenant?: string;
    locale?: string;
}

interface Apps {
    group: GroupApplication;
    model: ModelApplication;
    entry: EntryApplication;
    // page: PageApplication;
    // folder: FolderApplication;
    fetcher: FetchEntriesApplication;
    tenants: TenantsApplication;
    entryPerTenant: EntryPerTenantApplication;
}

export class Application implements IBaseApplication {
    public readonly graphql: GraphQLApplication;
    private readonly args: ApplicationParams;
    private readonly apps: Apps;

    public constructor(argv: ApplicationParams) {
        this.args = argv;
        const env = getEnv();

        this.graphql = new GraphQLApplication({
            url: env.url,
            token: env.token,
            tenant: argv.tenant
        });
        this.apps = {
            group: new GroupApplication(this),
            model: new ModelApplication(this),
            entry: new EntryApplication(this),
            fetcher: new FetchEntriesApplication(this),
            // page: new PageApplication(this),
            // folder: new FolderApplication(this)
            tenants: new TenantsApplication(this),
            entryPerTenant: new EntryPerTenantApplication(this)
        };
    }

    public getBooleanArg(name: string, def: boolean = false): boolean {
        if (this.args[name as keyof ApplicationParams] === undefined) {
            return def;
        }
        return !!this.args[name as keyof ApplicationParams];
    }

    public getNumberArg(name: string, def: number): number {
        if (this.args[name as keyof ApplicationParams] === undefined) {
            return def;
        }
        const value = Number(this.args[name as keyof ApplicationParams]);
        if (isNaN(value)) {
            return def;
        }
        return value > 0 ? value : def;
    }

    public getStringArg(name: string, def: string): string {
        if (this.args[name as keyof ApplicationParams] === undefined) {
            return def;
        }
        return String(this.args[name as keyof ApplicationParams]);
    }

    public getApp<T>(name: string): T {
        if (!this.apps[name as keyof Apps]) {
            throw new Error(`App ${name} is not defined.`);
        }
        return this.apps[name as keyof Apps] as T;
    }

    public async run(): Promise<void> {
        const createData = this.getBooleanArg("create-data");
        const createTenants = this.getBooleanArg("create-tenants");
        const createDataPerTenant = this.getBooleanArg("create-data-per-tenant");
        const fetchData = this.getBooleanArg("fetch-data");
        if (createData) {
            // await this.apps.folder.run();
            await this.apps.group.run();
            await this.apps.model.run();
            await this.apps.entry.run();
            // await this.apps.page.run();
        } else if (fetchData) {
            await this.apps.fetcher.run();
        } else if (createTenants) {
            await this.apps.tenants.run();
        } else if (createDataPerTenant) {
            await this.apps.entryPerTenant.run();
        }
    }
}
