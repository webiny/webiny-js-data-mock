import { createField } from "./createField";

export const createRichTextField = createField({
    type: "rich-text",
    definition: field => {
        return field.fieldId;
    }
});
