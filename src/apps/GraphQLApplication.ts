import { ApiGraphQLResult, IGraphQLApplication } from "~/types";
import fetch, { Headers, HeadersInit, Response } from "node-fetch-commonjs";
import { GraphQLError } from "~/errors";
import lodashChunk from "lodash/chunk";

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

    public async query<T>(
        query: string,
        variables?: Record<string, any>
    ): Promise<ApiGraphQLResult<T>> {
        const response = await fetch(this.url, {
            method: "POST",
            headers: this.createHeaders(),
            body: JSON.stringify({
                query,
                variables: variables || {}
            })
        });
        return this.parse(response);
    }

    public async mutation<T>(
        mutation: string,
        variables: Record<string, any>
    ): Promise<ApiGraphQLResult<T>> {
        const response = await fetch(this.url, {
            method: "POST",
            headers: this.createHeaders(),
            body: JSON.stringify({
                query: mutation,
                variables
            })
        });
        return this.parse<T>(response);
    }

    public async mutations<T>(
        mutation: string,
        variablesList: Record<string, any>[],
        atOnce?: number
    ): Promise<ApiGraphQLResult<T>[]> {
        const results: ApiGraphQLResult<T>[] = [];
        const chunks = lodashChunk(variablesList, atOnce || 1);
        for (const chunk of chunks) {
            const chunkResult = await Promise.all(
                chunk.map(variables => this.mutation<T>(mutation, variables))
            );
            for (const result of chunkResult) {
                results.push(result);
            }
        }
        return results;
    }

    private async parse<T = any>(response: Response): Promise<ApiGraphQLResult<T>> {
        if (response.status !== 200) {
            throw new GraphQLError(
                `Request failed with status ${response.status}.`,
                response.status,
                JSON.stringify(response)
            );
        }
        const json = (await response.json()) as any;
        const { data: result, extensions = [], errors = [] } = json || {};
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
