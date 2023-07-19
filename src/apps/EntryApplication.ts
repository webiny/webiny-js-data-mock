import {
    ApiCmsError,
    ApiCmsModel,
    CmsEntry,
    IBaseApplication,
    IEntryApplication,
    IEntryApplicationCreateViaGraphQLResponse
} from "~/types";

import { logger } from "~/logger";
import { executeBlog } from "~/apps/entry/blog";

const allowedFieldTypes = ["text", "number", "boolean", "long-text", "rich-text", "datetime"];

interface ApiCmsEntries {
    [key: string]: CmsEntry[];
}

export class EntryApplication implements IEntryApplication {
    private readonly app: IBaseApplication;

    private entries: ApiCmsEntries = {};

    public constructor(app: IBaseApplication) {
        this.app = app;
    }

    public async run(): Promise<void> {
        logger.debug("Creating blog entries...");
        const blogResult = await this.runCreateBlog();
        logger.debug(`...${this.getResultCount(blogResult)} blog entries created.`);
    }

    public getEntries<T extends CmsEntry>(name: string): T[] {
        if (!this.entries[name]) {
            throw new Error(`There are no entries for "${name}".`);
        }
        return this.entries[name] as unknown as T[];
    }

    private async runCreateBlog() {
        const result = await executeBlog(this.app);

        this.logErrors(result.errors);

        this.addEntries({
            categories: result.categories,
            authors: result.authors,
            articles: result.articles
        });
        return result;
    }

    private logErrors(errors: ApiCmsError[]) {
        for (const error of errors) {
            logger.error(error);
        }
    }

    private addEntries(entries: ApiCmsEntries): void {
        for (const name in entries) {
            if (entries[name].length === 0) {
                continue;
            }
            if (!this.entries[name]) {
                this.entries[name] = [];
            }
            this.entries[name].push(...entries[name]);
        }
    }

    public async createViaGraphQL<T>(
        model: ApiCmsModel,
        variableList: Record<string, any>[]
    ): Promise<IEntryApplicationCreateViaGraphQLResponse<T>> {
        const mutation = this.createGraphQLMutation(model);

        const result = await this.app.graphql.mutations<T>(
            mutation,
            variableList.map(variables => {
                return { data: variables };
            })
        );
        const errors: ApiCmsError[] = [];
        const entries: T[] = [];
        for (const item of result) {
            if (item.error) {
                errors.push(item.error);
                continue;
            } else if (!item.data) {
                continue;
            }
            entries.push(item.data);
        }
        return {
            entries,
            errors
        };
    }

    private createGraphQLMutation(model: ApiCmsModel): string {
        return `
            mutation Create${model.singularApiName}($data: ${model.singularApiName}Input!) {
                data: create${model.singularApiName}(data: $data) {
                    data {
                        id
                        entryId
                        ${this.createModelFields(model.fields)}
                    }
                    error {
                        message
                        code
                        data
                    }
                }
            }
        `;
    }

    private createModelFields(fields: ApiCmsModel["fields"]): string {
        return fields
            .filter(field => {
                return allowedFieldTypes.includes(field.type);
            })
            .map(field => {
                return field.fieldId;
            })
            .join("\n");
    }

    private getResultCount(results: any): number {
        if (typeof results !== "object" || Object.keys(results).length === 0) {
            return 0;
        }
        let total = 0;
        for (const key in results) {
            if (key === "error" || !Array.isArray(results[key])) {
                continue;
            }
            total = total + results[key].length;
        }
        return total;
    }
}
