import { ApiGraphQLResult, ApiGraphQLResultJson, GenericRecord } from "~/types";

export const getCmsContentResult = (
    json: ApiGraphQLResultJson
): ApiGraphQLResult<GenericRecord> => {
    const { data: result, extensions = [], errors = [] } = json;
    return {
        data: result?.data?.data || null,
        error: result?.data?.error || errors[0],
        extensions
    };
};
