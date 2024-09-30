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

        const perTenant = this.app.getNumberArg("amount", 5);
        const tenantsInput = this.app.getStringArg("tenants", "").split(",").filter(Boolean);
        const modelsInput = this.app.getStringArg("models", "").split(",").filter(Boolean);

        if (perTenant <= 0) {
            throw new Error("Amount must be greater than 0.");
        }

        if (!modelsInput?.length) {
            throw new Error("No models specified.");
        }

        if (!tenantsInput?.length) {
            throw new Error("No tenants specified.");
        }

        const entryApp = this.app.getApp<EntryApplication>("entry");

        let tenants: ITenant[] = await this.app.getApp<TenantsApplication>("tenants").listTenants();
        if (tenantsInput[0] !== "*") {
            tenants = tenants.filter(tenant => {
                const id = tenant.id.toLowerCase();
                const name = tenant.name.toLowerCase();
                return tenantsInput.some(tenantInput => {
                    const tenantInputName = tenantInput.toLowerCase();
                    return tenantInputName === name || tenantInputName === id;
                });
            });
        }
        logger.info(`Running through ${tenants.length} tenants.`);

        for (const tenant of tenants) {
            const id = tenant.id;
            this.app.graphql.setTenant(id);

            const modelApp = this.app.getApp<ModelApplication>("model");

            let { data: models } = await modelApp.list();
            if (!models?.length) {
                logger.error(`Tenant "${tenant.name}" has no models.`);
                continue;
            }
            if (modelsInput[0] !== "*") {
                models = models.filter(m => {
                    const name = m.modelId.toLowerCase();
                    return modelsInput.some(i => {
                        return i.toLowerCase() === name;
                    });
                });
            }

            if (models.length === 0) {
                logger.debug("Skipping tenant as no models were found from the selected ones.");
                continue;
            }

            for (const model of models) {
                logger.debug(
                    `Creating tenant "${tenant.name}" entries for model "${model.modelId}"...`
                );
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
}
