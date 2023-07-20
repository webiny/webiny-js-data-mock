import {
    ApiCmsError,
    ApiCmsModel,
    CmsEntry,
    IBaseApplication,
    IEntryApplication,
    IEntryApplicationCreateViaGraphQLResponse,
    IEntryRunner,
    IEntryRunnerResponse
} from "~/types";

import { logger } from "~/logger";
import { blogRunnerFactory } from "~/apps/entry/blog";
import { carsRunnerFactory } from "~/apps/entry/cars";

const allowedFieldTypes = ["text", "number", "boolean", "long-text", "rich-text", "datetime"];

interface ApiCmsEntries {
    [key: string]: CmsEntry[];
}

export class EntryApplication implements IEntryApplication {
    private readonly app: IBaseApplication;

    private readonly entries: ApiCmsEntries = {};

    private readonly runners: IEntryRunner[];

    public constructor(app: IBaseApplication) {
        this.app = app;

        this.runners = [blogRunnerFactory(this.app), carsRunnerFactory(this.app)];
    }

    public async run(): Promise<void> {
        for (const runner of this.runners) {
            logger.info(`Creating ${runner.name} entries...`);
            const result = await runner.exec();
            this.setResult(result);
            logger.info(`${result.total} ${runner.name} entries created.`);
            if (result.errors.length > 0) {
                logger.info(`${result.errors.length} errors occurred.`);
            }
        }
    }

    public getEntries<T extends CmsEntry>(name: string): T[] {
        if (!this.entries[name]) {
            throw new Error(`There are no entries for "${name}".`);
        }
        return this.entries[name] as unknown as T[];
    }

    private setResult(result: IEntryRunnerResponse<Record<string, any>>): void {
        for (const key in result) {
            if (!result[key] || !Array.isArray(result[key])) {
                continue;
            }
            if (key === "errors") {
                this.logErrors(result.errors);
                continue;
            }
            this.addEntries({
                [key]: result[key]
            });
        }
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
}
