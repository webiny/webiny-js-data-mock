import { createField } from "./createField";

export const createTextField = createField({
    type: "text",
    definition: field => {
        return field.fieldId;
    }
});
