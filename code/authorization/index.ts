import { createAllTenantsApiKeyAuthenticator } from "./allTenantsApiKeyAuthenticator";

export const createAuthenticator = () => {
    return [createAllTenantsApiKeyAuthenticator()];
};
