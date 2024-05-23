import { ApiGraphQLResult, ApiGraphQLResultJson, GenericRecord } from "~/types";

export const getPageBuilderPageResult = (
    json: ApiGraphQLResultJson
): ApiGraphQLResult<GenericRecord> => {
    const { data: result, extensions = [], errors = [] } = json;
    return {
        data: result?.data?.pageBuilder?.data || null,
        error: result?.data?.pageBuilder?.error || errors[0],
        extensions
    };
};
