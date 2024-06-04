import {
    ApiCmsModel,
    ApiGraphQLResult,
    IBaseApplication,
    IFetchEntriesApplication,
    IModelApplication
} from "~/types";

import { logger } from "~/logger";

interface ApiResultEntry {
    id: string;
    entryId: string;
}

interface IFetchEntriesOptions {
    cursor?: string | undefined;
    limit: number;
}

export class FetchEntriesApplication implements IFetchEntriesApplication {
    private readonly app: IBaseApplication;
    public constructor(app: IBaseApplication) {
        this.app = app;
    }

    public async run(): Promise<void> {
        const modelId = this.app.getStringArg("model", "");
        if (!modelId) {
            throw new Error(`There is no model specified.`);
        }

        logger.debug(`Fetching model: ${modelId}...`);
        const model = await this.app.getApp<IModelApplication>("model").fetch(modelId);
        logger.debug("...done.");

        let cursor: string | null | undefined = null;
        let current = 1;
        const entries = new Set<string>();

        const maxRuns = this.app.getNumberArg("max-runs", 100);
        const limitPerRun = this.app.getNumberArg("limit", 1000);

        while (current < maxRuns) {
            logger.debug(`Current page: ${current}. Cursor: ${cursor || "none"}`);
            const result = await this.fetchEntries(model, {
                cursor: cursor || undefined,
                limit: limitPerRun
            });
            if (!result?.data) {
                logger.info(`No more to fetch. Fetched: ${entries.size} entries.`);
                return;
            }

            cursor = result.meta?.cursor;

            for (const entry of result.data) {
                entries.add(entry.entryId);
            }
            current++;
            if (!result.meta?.hasMoreItems) {
                logger.info(`No more to fetch. Fetched: ${entries.size} entries.`);
                return;
            }
        }
    }

    private async fetchEntries(
        model: ApiCmsModel,
        options: IFetchEntriesOptions
    ): Promise<ApiGraphQLResult<ApiResultEntry[]> | null> {
        const { cursor, limit } = options;
        const query = /* GraphQL */ `
            query List${model.pluralApiName}($after: String, $limit: Int) {
                ${model.pluralApiName}: list${model.pluralApiName}(after: $after, limit: $limit) {
                data {
                    id
                    entryId
                }
                meta {
                    cursor
                    hasMoreItems
                    totalCount
                }
            }
            }
        `;

        return await this.app.graphql.query<ApiResultEntry[]>({
            query,
            path: "/cms/manage/en-US",
            variables: {
                after: cursor,
                limit
            },
            getResult: data => {
                const content = data.data[model.pluralApiName];
                return {
                    data: content.data,
                    meta: content.meta,
                    error: content.error,
                    extensions: data.data.extensions
                } as ApiGraphQLResult<ApiResultEntry[]>;
            }
        });
    }
}
