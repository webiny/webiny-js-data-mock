import { createTenantGraphQl } from "./createTenantGraphQl.js";
export const createTenantsMockDataPlugins = () => {
    return [createTenantGraphQl()];
};
