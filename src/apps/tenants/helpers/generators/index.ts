import { ApiCmsModelField } from "~/types";
import { IGenerator, IRegistryGenerator } from "~/apps/tenants/helpers/generators/types";
import { registry } from "./registry";

import "./fields";
import "./validators";

export interface IGetGeneratorParams {
    field: ApiCmsModelField;
}

export const getGenerator = <T extends IGenerator<unknown>>({
    field
}: IGetGeneratorParams): IRegistryGenerator<T> => {
    return registry.getGenerator<T>({
        field
    });
};
