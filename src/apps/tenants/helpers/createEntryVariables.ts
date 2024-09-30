import { ApiCmsModel, GenericRecord } from "~/types";
import { getGenerator } from "./generators";

export const createEntryVariables = (
    model: Pick<ApiCmsModel, "fields">,
    length: number
): GenericRecord[] => {
    return Array(length)
        .fill(0)
        .map(() => {
            return model.fields.reduce<GenericRecord>((values, field) => {
                const generator = getGenerator(field);
                values[field.fieldId] = generator.generate(field);
                return values;
            }, {});
        });
};
