import {
    ApiGraphQLResult,
    ApiGraphQLResultJson,
    IGraphQLApplication,
    IGraphQLApplicationGetResult,
    IGraphQLApplicationMutationParams,
    IGraphQLApplicationMutationsParams,
    IGraphQLApplicationQueryParams
} from "~/types";
import fetch, { Headers, HeadersInit, Response } from "node-fetch-commonjs";
import { GraphQLError } from "~/errors";
import lodashChunk from "lodash/chunk";
import { logger } from "~/logger";

const headers: HeadersInit = {
    "Content-Type": "application/json"
};

interface Params {
    url: string;
    token: string;
    tenant?: string;
}

export class GraphQLApplication implements IGraphQLApplication {
    private readonly url: string;
    private readonly headers: HeadersInit;

    public constructor(params: Params) {
        const { url, token } = params;
        const tenant = params.tenant || "root";
        this.url = url;
        this.headers = {
            authorization: `Bearer ${token}`,
            "x-tenant": tenant
        };
    }

    public async query<T>(params: IGraphQLApplicationQueryParams<T>): Promise<ApiGraphQLResult<T>> {
        const { query, path, variables, getResult } = params;
        const response = await fetch(this.createUrl(path), {
            method: "POST",
            headers: this.createHeaders(),
            body: JSON.stringify({
                query,
                variables: variables || {}
            })
        });
        return this.parse(response, getResult);
    }

    public async mutation<T>(
        params: IGraphQLApplicationMutationParams<T>
    ): Promise<ApiGraphQLResult<T>> {
        const { mutation, path, variables, getResult } = params;
        const response = await fetch(this.createUrl(path), {
            method: "POST",
            headers: this.createHeaders(),
            body: JSON.stringify({
                query: mutation,
                variables
            })
        });
        return this.parse<T>(response, getResult);
    }

    public async mutations<T>(
        params: IGraphQLApplicationMutationsParams<T>
    ): Promise<ApiGraphQLResult<T>[]> {
        const { mutation, path, variables, atOnce, getResult } = params;
        const results: ApiGraphQLResult<T>[] = [];
        const chunks = lodashChunk(variables, atOnce || 1);
        logger.debug(`Total batches to execute: ${chunks.length}.`);
        for (const index in chunks) {
            const current = Number(index) + 1;
            logger.trace(`Executing batch ${current} of ${chunks.length}...`);
            const chunk = chunks[index];
            const chunkResult = await Promise.all(
                chunk.map(vars =>
                    this.mutation<T>({
                        mutation,
                        path,
                        variables: vars,
                        getResult
                    })
                )
            );
            logger.trace(`...executed.`);
            for (const result of chunkResult) {
                results.push(result);
            }
        }
        return results;
    }

    private async parse<T = any>(
        response: Response,
        getResult: IGraphQLApplicationGetResult<T>
    ): Promise<ApiGraphQLResult<T>> {
        if (response.status !== 200) {
            throw new GraphQLError(
                `Request failed with status ${response.status}.`,
                response.status,
                JSON.stringify(response)
            );
        }
        const json = (await response.json()) as ApiGraphQLResultJson;
        return getResult(json);
    }

    private createUrl(path: string): string {
        if (path.match(/\/$/) !== null) {
            throw new Error("URL cannot end with /.");
        } else if (path.match(/^\//) === null) {
            throw new Error("URL must start with /.");
        }
        return `${this.url}${path}`;
    }

    private createHeaders(): Headers {
        return new Headers({
            ...headers,
            ...this.headers
        });
    }
}
