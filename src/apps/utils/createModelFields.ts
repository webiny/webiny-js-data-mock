import { ApiCmsModelField } from "~/types";
import { createAllowedFields } from "~/apps/utils/fields";

const allowedFieldTypes = createAllowedFields();

export const createModelFields = (fields: ApiCmsModelField[]): string => {
    return fields
        .reduce<string[]>((collection, field) => {
            const create = allowedFieldTypes[field.type];
            if (!create) {
                return collection;
            }

            collection.push(create(field));

            return collection;
        }, [])
        .join("\n");
};
