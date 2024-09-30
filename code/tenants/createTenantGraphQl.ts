import zod from "zod";
import { ErrorResponse, GraphQLSchemaPlugin, Response } from "@webiny/handler-graphql";
import { Plugin } from "@webiny/plugins/types";
import { CmsContext } from "@webiny/api-headless-cms/types";
import { CreateAndInstallTenant } from "./CreateAndInstallTenant";
import { createZodError } from "@webiny/utils";

const validateInstallNamedTenantInput = zod.object({
    name: zod.string()
});

const createTenantGraphQlPlugin = (): Plugin => {
    return new GraphQLSchemaPlugin<CmsContext>({
        typeDefs: /* GraphQL */ `
            type GenericError {
                code: String
                message: String
                data: JSON
                stack: String
            }

            type InstallNamedTenantResponseTenant {
                id: String!
                name: String!
            }

            type InstallNamedTenantResponse {
                data: InstallNamedTenantResponseTenant
                error: GenericError
            }

            extend type Mutation {
                installNamedTenant(name: String!): InstallNamedTenantResponse!
            }
        `,
        resolvers: {
            Mutation: {
                installNamedTenant: async (_, args, context) => {
                    try {
                        const result = validateInstallNamedTenantInput.safeParse(args);
                        if (!result.success) {
                            throw createZodError(result.error);
                        }
                        const tenant = await new CreateAndInstallTenant(context).execute(
                            result.data.name
                        );
                        return new Response(tenant);
                    } catch (e) {
                        return new ErrorResponse(e);
                    }
                }
            }
        }
    });
};

export const createTenantGraphQl = (): Plugin[] => {
    return [createTenantGraphQlPlugin()];
};
