import { ApiCmsGroup, IGroupApplication, IBaseApplication } from "~/types";
import { createBlog, createCars } from "~/apps/group";
import { CmsGroup } from "~/apps/group/types";
import { logger } from "~/logger";

export class GroupApplication implements IGroupApplication {
    private readonly app: IBaseApplication;
    public readonly groups: ApiCmsGroup[] = [];
    public constructor(app: IBaseApplication) {
        this.app = app;
    }

    public getGroups(): ApiCmsGroup[] {
        return this.groups;
    }

    public async run(): Promise<void> {
        const groups = [createBlog(), createCars()];

        logger.debug("Listing groups to check if any already exist.");
        const { data: listedData, error: listedError } = await this.list();

        if (listedError) {
            logger.error(listedError);
            return;
        }

        for (const group of groups) {
            logger.debug(`Checking for the group "${group.name}".`);
            const exists = listedData.find(g => g.slug.toLowerCase() === group.slug.toLowerCase());
            if (exists) {
                logger.debug("Group already exists, skipping...");
                this.groups.push(exists);
                continue;
            }
            logger.debug(`Creating group "${group.name}"...`);
            const { data, error } = await this.create(group);
            if (error) {
                logger.error(error);
                continue;
            } else if (!data) {
                logger.error(`No data received after created the group: ${group.name}`);
                continue;
            }
            logger.debug("...group created.");
            this.groups.push(data);
        }
    }

    private async list() {
        return await this.app.graphql.query<ApiCmsGroup[]>(`
            query {
                data: listContentModelGroups {
                    data {
                        id
                        name
                        slug
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

    private async create(group: CmsGroup) {
        return await this.app.graphql.mutation<ApiCmsGroup>(
            `
            mutation CreateGroupMutation($data: CmsContentModelGroupInput!) {
                data: createContentModelGroup(data: $data) {
                    data {
                        id
                        name
                        slug
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
                    name: group.name,
                    slug: group.slug,
                    icon: "fa/fas"
                }
            }
        );
    }
}
