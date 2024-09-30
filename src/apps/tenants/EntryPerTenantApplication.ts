import { IApplication, IBaseApplication } from "~/types";
import { ITenant, TenantsApplication } from "./TenantsApplication";
import { ModelApplication } from "~/apps/ModelApplication";
import { EntryApplication } from "~/apps/EntryApplication";
import { createEntryVariables } from "~/apps/tenants/helpers/createEntryVariables";
import { logger } from "~/logger";

export class EntryPerTenantApplication implements IApplication {
    private readonly app: IBaseApplication;

    public constructor(app: IBaseApplication) {
        this.app = app;
    }

    public async run(): Promise<void> {
        this.app.graphql.setTenant("root");

        const input = this.app.getStringArg("tenants", "").split(",").filter(Boolean);
        const perTenant = this.app.getNumberArg("amount", 5);

        const modelId = this.app.getStringArg("model", "");
        if (!modelId) {
            throw new Error("No model specified.");
        }
        const entryApp = this.app.getApp<EntryApplication>("entry");

        if (!input?.length) {
            throw new Error("No tenants specified.");
        }

        let tenants: ITenant[] = await this.app.getApp<TenantsApplication>("tenants").listTenants();
        if (input[0] !== "*") {
            tenants = tenants.filter(t => {
                const name = t.name.toLowerCase();
                return input.some(i => {
                    return i.toLowerCase() === name;
                });
            });
        }

        logger.info(`Running through ${tenants.length} tenant(s).`);

        for (const tenant of tenants) {
            const id = tenant.id;
            this.app.graphql.setTenant(id);

            const modelApp = this.app.getApp<ModelApplication>("model");

            const model = await modelApp.fetch(modelId);
            if (!model) {
                throw new Error(`Model "${modelId}" not found.`);
            }

            const variables = createEntryVariables(model, perTenant);

            const result = await entryApp.createViaGraphQL(model, variables, variables.length);
            if (result.errors.length) {
                logger.error("Errors occurred while creating entries.");
                for (const error of result.errors) {
                    logger.error(error);
                }
                throw new Error("Errors occurred while creating entries.");
            }
        }
    }
}
