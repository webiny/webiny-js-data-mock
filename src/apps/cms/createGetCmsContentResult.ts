import { ApiGraphQLResult, ApiGraphQLResultJson } from "~/types";

export const createGetCmsContentResult = <T>() => {
    return (json: ApiGraphQLResultJson): ApiGraphQLResult<T> => {
        const { data: result, extensions = [], errors = [] } = json;
        return {
            data: result?.data?.data || null,
            error: result?.data?.error || errors[0],
            extensions
        };
    };
};
