import { IApplication, IBaseApplication } from "~/types";
import { TenantsApplication } from "./TenantsApplication";
import { ModelApplication } from "~/apps/ModelApplication";
import { EntryApplication } from "~/apps/EntryApplication";
import { createEntryVariables } from "~/apps/tenants/helpers/createEntryVariables";
import { logger } from "~/logger";
import { createCacheKey } from "~/cache";

export class EntryPerTenantApplication implements IApplication {
    private readonly app: IBaseApplication;

    public constructor(app: IBaseApplication) {
        this.app = app;
    }

    public async run(): Promise<void> {
        try {
            await this.execute();
        } finally {
            this.app.cache.enable();
        }
    }

    private async execute(): Promise<void> {
        this.app.graphql.setTenant("root");

        const perTenant = this.app.getNumberArg("amount", 5);
        const tenantsInput = this.app.getStringArg("tenants", "").split(",").filter(Boolean);
        const startFromTenant = this.app.getStringArg("startFromTenant", "").toLowerCase();
        const modelsInput = this.app.getStringArg("models", "").split(",").filter(Boolean);

        const useCache = this.app.getBooleanArg("cache", true);
        if (useCache === false) {
            this.app.cache.disable();
        }

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

        let tenants = await this.app.cache.getOrSet(
            createCacheKey({
                app: "entryPerTenant",
                key: "tenants"
            }),
            async () => {
                return await this.app.getApp<TenantsApplication>("tenants").listTenants();
            }
        );
        if (startFromTenant) {
            const startingTenant = tenants.findIndex(
                tenant => tenant.name.toLowerCase() === startFromTenant
            );
            if (startingTenant !== -1) {
                tenants = tenants.slice(startingTenant);
            }
        }
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
        if (tenants.length === 0) {
            logger.info(`No tenants matched to the input.`);
            this.app.cache.clear();
            return;
        }
        logger.info(`Running through ${tenants.length} tenants.`);

        for (const tenant of tenants) {
            const id = tenant.id;
            this.app.graphql.setTenant(id);

            const modelApp = this.app.getApp<ModelApplication>("model");

            let { data: models } = await this.app.cache.getOrSet(
                createCacheKey({ app: "entryPerTenant", key: "models", tenantId: id }),
                async () => {
                    return await modelApp.list();
                }
            );
            if (!models?.length) {
                logger.error(`Tenant "${tenant.name}" has no models.`);
                this.app.cache.clear();
                continue;
            }
            if (modelsInput[0] !== "*") {
                models = models.filter(m => {
                    const modelId = m.modelId.toLowerCase();
                    return modelsInput.some(i => {
                        return i.toLowerCase() === modelId;
                    });
                });
            }

            if (models.length === 0) {
                logger.debug("Skipping tenant as no models were found from the selected ones.");
                this.app.cache.clear();
                continue;
            }

            for (const model of models) {
                logger.debug(
                    `Creating tenant "${tenant.name}" entries for model "${model.modelId}"...`
                );
                const variables = await createEntryVariables(model, perTenant);

                const result = await entryApp.createViaGraphQL({
                    model,
                    variables,
                    atOnce: variables.length,
                    options: {
                        skipValidators: ["required"]
                    }
                });
                if (result.errors.length) {
                    logger.error("Errors occurred while creating entries.");
                    this.app.cache.clear();
                    for (const error of result.errors) {
                        logger.error(error);
                    }
                    throw new Error("Errors occurred while creating entries.");
                }
            }
        }
    }
}
