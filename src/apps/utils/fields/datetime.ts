import { createField } from "./createField";

export const createDatetimeField = createField({
    type: "datetime",
    definition: field => {
        return field.fieldId;
    }
});
