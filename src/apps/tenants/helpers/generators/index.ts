import { ApiCmsModelField } from "~/types";
import { IGenerator, IRegistryGenerator } from "~/apps/tenants/helpers/generators/types";
import { registry } from "./registry";

import "./fields";
import "./validators";

export const getGenerator = <T extends IGenerator<unknown>>(
    field: Pick<ApiCmsModelField, "type" | "multipleValues">
): IRegistryGenerator<T> => {
    return registry.getGenerator<T>({
        type: field.type,
        multipleValues: field.multipleValues || false
    });
};
