import { ApiGraphQLResult, ApiGraphQLResultJson } from "~/types";

export const getPageBuilderPageResult = (json: ApiGraphQLResultJson): ApiGraphQLResult<any> => {
    const { data: result, extensions = [], errors = [] } = json;
    return {
        data: result?.data?.pageBuilder?.data || null,
        error: result?.data?.pageBuilder?.error || errors[0],
        extensions
    };
};
