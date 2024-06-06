import { createField } from "./createField";

export const createFileField = createField({
    type: "file",
    definition: field => {
        return field.fieldId;
    }
});
