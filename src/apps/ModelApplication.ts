import { ApiCmsModel, IBaseApplication, IModelApplication } from "~/types";
import { createBlogModels } from "~/apps/model";
import { GroupApplication } from "~/apps/GroupApplication";
import { logger } from "~/logger";
import { CmsModel } from "~/apps/model/types";

export class ModelApplication implements IModelApplication {
    private readonly app: IBaseApplication;

    private readonly models: ApiCmsModel[] = [];

    public constructor(app: IBaseApplication) {
        this.app = app;
    }

    public getModels(): ApiCmsModel[] {
        return this.models;
    }

    public getModel(id: string): ApiCmsModel {
        const model = this.models.find(m => m.modelId === id);
        if (model) {
            return model;
        }
        throw new Error(`There is no model "${id}".`);
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
            logger.info(`Checking for the group "${model.name}".`);
            const exists = listedData.find(m => m.modelId === model.modelId);
            if (exists) {
                logger.info("Model already exists, skipping...");
                this.models.push(exists);
                continue;
            }
            logger.info(`Creating model "${model.name}"...`);
            const { data, error } = await this.create(model);
            if (error) {
                logger.error(error);
                continue;
            } else if (!data) {
                logger.error(`No data received after created the model: ${model.modelId}`);
                continue;
            }
            logger.info("...model created.");
            this.models.push(data);
        }
    }

    private async list() {
        return this.app.graphql.query<ApiCmsModel[]>(`
            query ListModels {
                data: listContentModels {
                    data {
                        name
                        modelId
                        singularApiName
                        pluralApiName
                        fields {
                            id
                            type
                            fieldId
                        }
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
                        name
                        modelId
                        singularApiName
                        pluralApiName
                        fields {
                            id
                            type
                            fieldId
                        }
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
