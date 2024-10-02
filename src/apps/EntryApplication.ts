import {
    ApiCmsModel,
    ApiError,
    CmsEntry,
    GenericRecord,
    IBaseApplication,
    IEntryApplication,
    IEntryApplicationCreateViaGraphQLParams,
    IEntryApplicationCreateViaGraphQLResponse,
    IEntryRunner,
    IEntryRunnerResponse
} from "~/types";
import { logger } from "~/logger";
import { blogRunnerFactory, simpleCarsRunnerFactory } from "./cms";
import { createGetCmsContentResult } from "./cms/createGetCmsContentResult";
import { createModelFields } from "./utils/createModelFields";

interface ApiCmsEntries {
    [key: string]: CmsEntry[];
}

export class EntryApplication implements IEntryApplication {
    private readonly app: IBaseApplication;

    private readonly entries: ApiCmsEntries = {};

    private readonly runners: IEntryRunner[];

    public constructor(app: IBaseApplication) {
        this.app = app;

        this.runners = [blogRunnerFactory(this.app), simpleCarsRunnerFactory(this.app)];
    }

    public async run(): Promise<void> {
        const skip = this.app.getStringArg(`skip`, "").split(",");
        for (const runner of this.runners) {
            if (skip.includes(`cms:${runner.id}`)) {
                logger.info(`Skipping runner "${runner.name}".`);
                continue;
            }
            logger.info(`Creating "${runner.name}" entries...`);
            const result = await runner.exec();
            this.setResult(result);
            logger.info(`${result.total} entries created.`);
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

    private setResult(result: IEntryRunnerResponse<GenericRecord>): void {
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

    private logErrors(errors: ApiError[]) {
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
        params: IEntryApplicationCreateViaGraphQLParams
    ): Promise<IEntryApplicationCreateViaGraphQLResponse<T>> {
        const { model, variables, atOnce = 1, options } = params;
        const mutation = this.createGraphQLMutation(model);

        const result = await this.app.graphql.mutations<T>({
            mutation,
            path: "/cms/manage/en-US",
            variables: variables.map(data => {
                return {
                    data,
                    options
                };
            }),
            atOnce,
            getResult: createGetCmsContentResult()
        });
        const errors: ApiError[] = [];
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
            mutation Create${model.singularApiName}($data: ${model.singularApiName}Input!, $options: CreateCmsEntryOptionsInput) {
                data: create${model.singularApiName}(data: $data, options: $options) {
                    data {
                        id
                        entryId
                        ${createModelFields(model.fields)}
                    }
                    error {
                        message
                        code
                        data
                        stack
                    }
                }
            }
        `;
    }
}
