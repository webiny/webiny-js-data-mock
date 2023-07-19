import { IGraphQLApplication } from "~/types";
import fetch, { Headers, HeadersInit } from "node-fetch-commonjs";

const headers: HeadersInit = {
    "Content-Type": "application/json"
};

interface Params {
    url: string;
    token: string;
    tenant?: string;
    locale?: string;
}

export class GraphQLApplication implements IGraphQLApplication {
    private readonly url: string;
    private readonly headers: HeadersInit;

    public constructor(params: Params) {
        const { url, token } = params;
        const locale = params.locale || "en-US";
        const tenant = params.tenant || "root";
        this.url = this.createUrl(url, locale);
        this.headers = {
            authorization: `Bearer ${token}`,
            "x-tenant": tenant
        };
    }

    public async query(query: string, variables?: Record<string, any>): Promise<any> {
        const result = await fetch(this.url, {
            method: "POST",
            headers: this.createHeaders(),
            body: JSON.stringify({
                query,
                variables: variables || {}
            })
        });
        return this.parse(result);
    }

    public async mutation(mutation: string, variables: Record<string, any>): Promise<any> {
        const result = await fetch(this.url, {
            method: "POST",
            headers: this.createHeaders(),
            body: JSON.stringify({
                query: mutation,
                variables
            })
        });
        return this.parse(result);
    }

    private async parse(response: any) {
        if (response.status !== 200) {
            throw new Error(`Request failed with status ${response.status}.`);
        }
        const json = await response.json();
        const { data: result, extensions = [], errors = [] } = json;
        return {
            data: result?.data?.data,
            error: result?.data?.error || errors[0],
            extensions: extensions
        };
    }

    private createUrl(url: string, locale: string): string {
        if (url.match(/\/$/) !== null) {
            throw new Error("URL cannot end with /.");
        }
        const parts = [url];

        if (url.match("/cms") !== null) {
            throw new Error("URL cannot contain /cms.");
        }
        if (url.match("/manage") !== null) {
            throw new Error("URL cannot contain /manage.");
        }
        parts.push("cms");
        parts.push("manage");
        parts.push(locale);

        return parts.join("/");
    }

    private createHeaders(): Headers {
        return new Headers({
            ...headers,
            ...this.headers
        });
    }
}
