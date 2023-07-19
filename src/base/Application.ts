import { IBaseApplication } from "~/types";
import { GroupApplication } from "~/apps/GroupApplication";
import { ModelApplication } from "~/apps/ModelApplication";
import { EntryApplication } from "~/apps/EntryApplication";
import dotenv from "dotenv";
import { GraphQLApplication } from "~/apps/GraphQLApplication";

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

interface ArgV {
    confirm?: boolean;
    tenant?: string;
    locale?: string;
    [key: string]: any;
}

interface Apps {
    group: GroupApplication;
    model: ModelApplication;
    entry: EntryApplication;
}

export class Application implements IBaseApplication {
    public readonly graphql: GraphQLApplication;
    private readonly confirm: boolean;
    private readonly apps: Apps;

    public constructor(argv: ArgV) {
        this.confirm = !!argv.confirm;
        const env = getEnv();

        this.graphql = new GraphQLApplication({
            url: env.url,
            token: env.token,
            tenant: argv.tenant,
            locale: argv.locale
        });
        this.apps = {
            group: new GroupApplication(this),
            model: new ModelApplication(this),
            entry: new EntryApplication(this)
        };
    }

    public getApp<T>(name: string): T {
        if (!this.apps[name as keyof Apps]) {
            throw new Error(`App ${name} is not defined.`);
        }
        return this.apps[name as keyof Apps] as T;
    }

    public async run(): Promise<void> {
        await this.apps.group.run();
        await this.apps.model.run();
        await this.apps.entry.run();
    }
}
