import { ApiCmsModelField } from "~/types";

const allowedFieldTypes = [
    "text",
    "number",
    "boolean",
    "long-text",
    "rich-text",
    "datetime",
    "ref",
    "file",
    "json"
];

export const createModelFields = (fields: ApiCmsModelField[]): string => {
    return fields
        .filter(field => {
            return allowedFieldTypes.includes(field.type);
        })
        .map(field => {
            return field.fieldId;
        })
        .join("\n");
};
