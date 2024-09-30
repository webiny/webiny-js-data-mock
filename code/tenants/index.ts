import { createTenantGraphQl } from "./createTenantGraphQl";
export const createTenantsMockDataPlugins = () => {
    return [createTenantGraphQl()];
};
