import { createAllTenantsApiKeyAuthenticator } from "./allTenantsApiKeyAuthenticator.js";

export const createAuthenticator = () => {
    return [createAllTenantsApiKeyAuthenticator()];
};
