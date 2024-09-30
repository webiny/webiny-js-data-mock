import { InstallTenant } from "@webiny/api-serverless-cms";
import { mdbid } from "@webiny/utils";
import { CmsContext } from "@webiny/api-headless-cms/types";
import { WebinyError } from "@webiny/error";

export class CreateAndInstallTenant {
    private readonly context: CmsContext;

    public constructor(context: CmsContext) {
        this.context = context;
    }

    public async executeWithoutError(name: string) {
        const { tenancy } = this.context;

        const exists = (await tenancy.listTenants()).find(t => t.name === name);
        if (exists) {
            return null;
        }

        const tenant = await tenancy.createTenant({
            id: mdbid(),
            name,
            parent: "root",
            description: name,
            tags: []
        });

        const installTenant = new InstallTenant(this.context);
        await installTenant.execute(tenant, {
            i18n: {
                defaultLocaleCode: "en-US"
            }
        });
        return tenant;
    }

    public async execute(name: string) {
        const result = await this.executeWithoutError(name);
        if (!result) {
            throw new WebinyError({
                message: `Tenant "${name}" already exists!`,
                code: "TENANT_ALREADY_EXISTS",
                data: {
                    name
                }
            });
        }
        return result;
    }
}
