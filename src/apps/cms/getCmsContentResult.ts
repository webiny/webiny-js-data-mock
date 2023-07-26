import { ApiGraphQLResult, ApiGraphQLResultJson } from "~/types";

export const getCmsContentResult = (json: ApiGraphQLResultJson): ApiGraphQLResult<any> => {
    const { data: result, extensions = [], errors = [] } = json;
    return {
        data: result?.data?.data || null,
        error: result?.data?.error || errors[0],
        extensions
    };
};
