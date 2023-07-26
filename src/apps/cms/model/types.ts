import {
    CmsGroup,
    CmsModel as BaseModel,
    CmsModelField as BaseCmsModelField
} from "@webiny/api-headless-cms/types";

export type CmsModelGroup = Pick<CmsGroup, "id" | "name">;

export type CmsModelField = Pick<
    BaseCmsModelField,
    | "id"
    | "fieldId"
    | "label"
    | "type"
    | "multipleValues"
    | "validation"
    | "listValidation"
    | "settings"
    | "renderer"
>;

export interface CmsModel
    extends Pick<
        BaseModel,
        | "modelId"
        | "name"
        | "description"
        | "group"
        | "layout"
        | "singularApiName"
        | "pluralApiName"
    > {
    fields: CmsModelField[];
}
