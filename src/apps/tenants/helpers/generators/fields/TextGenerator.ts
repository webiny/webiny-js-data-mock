import { faker } from "@faker-js/faker";
import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";
import { logger } from "~/logger";

class TextGenerator extends BaseGenerator<string> {
    public type = "text";

    public async generate(params: IGeneratorGenerateParams): Promise<string | null> {
        const { field, getValidator } = params;

        const values = field.predefinedValues?.values;
        if (values?.length) {
            const target = faker.number.int({
                min: 0,
                max: values.length - 1
            });
            return values[target].value;
        }

        const pattern = field.validation?.find(v => v.name === "pattern");

        if (pattern) {
            const preset = pattern.settings?.preset || "unknown";
            switch (preset) {
                case "email":
                    return faker.internet.email();
                case "url":
                    return faker.internet.url();
                default:
                    logger.warn(`There is no pattern preset generator for "${preset}"`);
                    return null;
            }
        }

        const options = {
            min: getValidator(MinimumLengthValidator).getValue(1),
            max: getValidator(MaximumLengthValidator).getValue(100)
        };

        const value = faker.lorem.words(options);

        return value.length > options.max ? value.slice(0, options.max) : value;
    }
}

class MultiTextGenerator extends BaseMultiGenerator<string> {
    public type = "text";

    public async generate(params: IGeneratorGenerateParams): Promise<string[]> {
        const { field, getValidator } = params;

        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(2)
        });
        return await this.iterate(total, async () => {
            return await this.getGenerator(TextGenerator).generate(field);
        });
    }
}

registry.registerGenerator(TextGenerator);
registry.registerGenerator(MultiTextGenerator);
