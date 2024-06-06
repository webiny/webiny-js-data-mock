import { createBooleanField } from "./boolean";
import { createDatetimeField } from "~/apps/utils/fields/datetime";
import { createFileField } from "~/apps/utils/fields/file";
import { createJsonField } from "~/apps/utils/fields/json";
import { createLongTextField } from "~/apps/utils/fields/richText";
import { createNumberField } from "~/apps/utils/fields/number";
import { createRefField } from "~/apps/utils/fields/ref";
import { createRichTextField } from "~/apps/utils/fields/longText";
import { createTextField } from "~/apps/utils/fields/text";
import { ICreateFieldDefinition } from "~/apps/utils/fields/createField";

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
