import { createField } from "./createField";

export const createJsonField = createField({
    type: "json",
    definition: field => {
        return field.fieldId;
    }
});
