import { ApiCmsModel, GenericRecord } from "~/types";
import { getGenerator } from "./generators";

export const createEntryVariables = async (
    model: Pick<ApiCmsModel, "fields">,
    length: number
): Promise<GenericRecord[]> => {
    return Promise.all(
        Array(length)
            .fill(0)
            .map(async () => {
                const values: GenericRecord = {};
                for (const field of model.fields) {
                    const generator = getGenerator(field);
                    values[field.fieldId] = await generator.generate(field);
                }
                return values;
            })
    );
};
