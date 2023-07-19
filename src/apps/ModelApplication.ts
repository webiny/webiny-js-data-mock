import { ApiCmsModel, IApplication, IBaseApplication } from "~/types";
import { createBlogModels } from "~/apps/model";
import { GroupApplication } from "~/apps/GroupApplication";
import { logger } from "~/logger";
import { CmsModel } from "~/apps/model/types";

export class ModelApplication implements IApplication {
    private readonly app: IBaseApplication;

    private models: ApiCmsModel[] = [];

    public constructor(app: IBaseApplication) {
        this.app = app;
    }

    public async run(): Promise<void> {
        const groupApp = this.app.getApp<GroupApplication>("group");
        const models = [...createBlogModels(groupApp)];

        const { data: listedData, error: listedError } = await this.list();

        if (listedError) {
            logger.error(listedError);
            return;
        }

        for (const model of models) {
            logger.debug(`Checking for the group "${model.name}".`);
            const exists = listedData.find(m => m.modelId === model.modelId);
            if (exists) {
                logger.debug("Model already exists, skipping...");
                this.models.push(exists);
                continue;
            }
            logger.debug(`Creating model "${model.name}"...`);
            const { data, error } = await this.create(model);
            if (error) {
                logger.error(error);
                continue;
            } else if (!data) {
                logger.error(`No data received after created the model: ${model.modelId}`);
                continue;
            }
            logger.debug("...model created.");
            this.models.push(data);
        }
    }

    private async list() {
        return this.app.graphql.query<ApiCmsModel[]>(`
            query ListModels {
                data: listContentModels {
                    data {
                        modelId
                        name
                    }
                    error {
                        message
                        code
                        data
                    }
                }
            }
        `);
    }

    private async create(model: CmsModel) {
        return this.app.graphql.mutation<ApiCmsModel>(
            `
            mutation CreateModel($data: CmsContentModelCreateInput!) {
                data: createContentModel(data: $data) {
                    data {
                        modelId
                        name
                    }
                    error {
                        message
                        code
                        data
                    }
                }
            }
        `,
            {
                data: {
                    ...model
                }
            }
        );
    }
}
