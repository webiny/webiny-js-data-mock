import { createBooleanField } from "./boolean.js";
import { createDatetimeField } from "./datetime.js";
import { createFileField } from "./file.js";
import { createJsonField } from "./json.js";
import { createLongTextField } from "./richText.js";
import { createNumberField } from "./number.js";
import { createRefField } from "./ref.js";
import { createRichTextField } from "./longText.js";
import { createTextField } from "./text.js";
import type { ICreateFieldDefinition } from "./createField.js";

export const createAllowedFields = () => {
    const creators = [
        createBooleanField,
        createDatetimeField,
        createFileField,
        createJsonField,
        createLongTextField,
        createNumberField,
        createRefField,
        createRichTextField,
        createTextField
    ];

    return creators.reduce<Record<string, ICreateFieldDefinition>>((collection, creator) => {
        const def = creator();

        collection[def.type] = def.definition;

        return collection;
    }, {});
};
