import { ApiCmsModelField } from "~/types";

export interface ICreateFieldDefinition {
    (field: ApiCmsModelField): string;
}

export interface ICreateFieldParams {
    type: string;
    definition: ICreateFieldDefinition;
}

export const createField = (params: ICreateFieldParams): (() => ICreateFieldParams) => {
    return () => params;
};
