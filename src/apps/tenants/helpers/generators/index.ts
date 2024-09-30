import { ApiCmsModelField } from "~/types";
import { IGenerator } from "~/apps/tenants/helpers/generators/types";
import { registry } from "./registry";

import "./types/index";

export const getGenerator = <T = unknown>(
    field: Pick<ApiCmsModelField, "type" | "multipleValues">
): IGenerator<T> => {
    return registry.getGenerator<T>({
        type: field.type,
        multipleValues: field.multipleValues || false
    });
};
