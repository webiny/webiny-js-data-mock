import { ContextPlugin } from "@webiny/handler-aws";
import { CmsContext } from "@webiny/api-headless-cms/types";

export const createAllTenantsApiKeyAuthenticator = () => {
    return new ContextPlugin<CmsContext>(context => {
        context.security.addAuthenticator(async token => {
            if (typeof token !== "string" || !token.startsWith("a")) {
                return null;
            }

            const tenant = context.tenancy.getCurrentTenant();
            if (!tenant) {
                console.log(`Missing tenant "${context.request.headers["x-tenant"]}".`);
                return null;
            }

            const apiKey = await context.security
                .getStorageOperations()
                .getApiKeyByToken({ tenant: "root", token });

            if (!apiKey) {
                console.log(`API key "${token}" not found.`);
                return null;
            }

            return {
                id: apiKey.id,
                permissions: [
                    {
                        name: "*"
                    },
                    ...apiKey.permissions
                ],
                displayName: apiKey.name,
                type: "api-key"
            };
        });
    });
};
