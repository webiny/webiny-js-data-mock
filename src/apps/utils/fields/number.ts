import { createField } from "./createField";

export const createNumberField = createField({
    type: "number",
    definition: field => {
        return field.fieldId;
    }
});
