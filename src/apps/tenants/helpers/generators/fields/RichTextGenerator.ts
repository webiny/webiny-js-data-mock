import { faker } from "@faker-js/faker";
import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
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

    public async generate(): Promise<GenericRecord> {
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

class MultiRichTextGenerator extends BaseMultiGenerator<GenericRecord> {
    public type = "rich-text";
    public multipleValues = true;

    public async generate({
        field,
        getValidator
    }: IGeneratorGenerateParams): Promise<GenericRecord[]> {
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return this.iterate(total, async () => {
            return this.getGenerator(RichTextGenerator).generate(field);
        });
    }
}

registry.registerGenerator(RichTextGenerator);
registry.registerGenerator(MultiRichTextGenerator);
