import { IBaseApplication, IPageApplication, IPageRunner, PbPage, PbPageInput } from "~/types";
import { createGetPageBuilderPageResult } from "./pageBuilder/createGetPageBuilderPageResult";
import { pageRunnerFactory } from "./pages/pages";
import { logger } from "~/logger";

export class PageApplication implements IPageApplication {
    private readonly app: IBaseApplication;

    private readonly pages: PbPage[] = [];
    private readonly runner: IPageRunner;

    public constructor(app: IBaseApplication) {
        this.app = app;
        this.runner = pageRunnerFactory(this.app);
    }

    public getPages(): PbPage[] {
        return this.pages;
    }

    public async run(): Promise<void> {
        const skip = this.app.getStringArg(`skip`, "").split(",").includes("page");
        if (skip) {
            logger.info(`Skipping runner page runner.`);
            return;
        }
        logger.info(`Creating pages...`);
        const result = await this.runner.exec();
        this.pages.push(...result.pages);
        logger.info(`${this.pages.length} pages created.`);
    }

    public async createViaGraphQL(variables: PbPageInput): Promise<PbPage> {
        const createMutation = this.createGraphQLCreateMutation();
        const updateMutation = this.createGraphQLUpdateMutation();

        const createResponse = await this.app.graphql.mutation<PbPage>({
            mutation: createMutation,
            path: "/graphql",
            variables: {
                category: variables.category
            },
            getResult: createGetPageBuilderPageResult()
        });
        if (createResponse.error) {
            throw createResponse.error;
        }
        const page = createResponse.data;
        if (!page?.id) {
            throw new Error(`Missing page ID for newly created page!`);
        }

        const updateResponse = await this.app.graphql.mutation<PbPage>({
            mutation: updateMutation,
            path: "/graphql",
            variables: {
                id: page.id,
                data: {
                    ...variables
                }
            },
            getResult: createGetPageBuilderPageResult()
        });
        if (updateResponse.error) {
            throw updateResponse.error;
        } else if (!updateResponse.data?.id) {
            throw new Error(`Missing page data for newly created page!`);
        }
        return updateResponse.data;
    }

    private createGraphQLCreateMutation(): string {
        return `
            mutation CreatePage($category: ID!) {
                pageBuilder {
                    data {
                        id
                        pid
                        title
                        category {
                            slug
                            name
                            url
                        }
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

    private createGraphQLUpdateMutation(): string {
        return `
            mutation UpdatePage($id: ID!, $data: PbUpdatePageInput!) {
                pageBuilder {
                    data {
                        id
                        pid
                        category {
                            slug
                            name
                            url
                        }
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
}
