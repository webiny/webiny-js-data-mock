import { createField } from "./createField";

export const createBooleanField = createField({
    type: "boolean",
    definition: field => {
        return field.fieldId;
    }
});
