import { createField } from "./createField";

export const createLongTextField = createField({
    type: "long-text",
    definition: field => {
        return field.fieldId;
    }
});
