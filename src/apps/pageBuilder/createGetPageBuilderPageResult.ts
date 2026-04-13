import type { ApiGraphQLResult, ApiGraphQLResultJson } from "~/types.js";

export const createGetPageBuilderPageResult = <T>() => {
    return (json: ApiGraphQLResultJson): ApiGraphQLResult<T> => {
        const { data: result, extensions = [], errors = [] } = json;
        return {
            data: result?.data?.pageBuilder?.data || null,
            error: result?.data?.pageBuilder?.error || errors[0],
            extensions
        };
    };
};
