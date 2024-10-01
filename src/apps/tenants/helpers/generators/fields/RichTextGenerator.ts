import { faker } from "@faker-js/faker";
import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import { GenericRecord } from "~/types";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";

class RichTextGenerator extends BaseGenerator<GenericRecord> {
    public type = "rich-text";
    public multipleValues = false;

    public generate(): GenericRecord {
        return {
            type: "paragraph",
            children: [
                {
                    text: faker.lorem.words({
                        min: 1,
                        max: 3
                    })
                }
            ]
        };
    }
}

class MultiRichTextGenerator extends BaseGenerator<GenericRecord[]> {
    public type = "rich-text";
    public multipleValues = true;

    public generate({ getValidator }: IGeneratorGenerateParams): GenericRecord[] {
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return this.getGenerator(RichTextGenerator).generate();
            });
    }
}

registry.registerGenerator(RichTextGenerator);
registry.registerGenerator(MultiRichTextGenerator);
