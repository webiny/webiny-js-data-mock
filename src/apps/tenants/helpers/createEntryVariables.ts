import { ApiCmsModel, GenericRecord } from "~/types";
import { getGenerator } from "./generators";
import { logger } from "~/logger";

export const createEntryVariables = async (
    model: Pick<ApiCmsModel, "fields">,
    amount: number
): Promise<GenericRecord[]> => {
    try {
        return await Promise.all(
            Array(amount)
                .fill(0)
                .map(async () => {
                    const values: GenericRecord = {};
                    for (const field of model.fields) {
                        const generator = getGenerator({
                            field
                        });
                        values[field.fieldId] = await generator.generate(field);
                    }
                    return values;
                })
        );
    } catch (ex) {
        logger.info("");
        logger.error(ex);
        throw ex;
    }
};
