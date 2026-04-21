import { faker } from "@faker-js/faker";
import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator.js";
import { registry } from "../registry.js";
import {
    MaximumLengthValidator,
    MinimumLengthValidator,
    PatternValidator
} from "../validators/index.js";
import type { IGeneratorGenerateParams } from "../types.js";
import { logger } from "~/logger.js";

class LongTextGenerator extends BaseGenerator<string> {
    public type = "long-text";

    public async generate({ getValidator }: IGeneratorGenerateParams): Promise<string> {
        const validation = getValidator(PatternValidator).getValue();

        if (validation) {
            const preset = validation.preset || "unknown";
            switch (preset) {
                case "email":
                    return faker.internet.email();
                case "url":
                    return faker.internet.url();
                default:
                    logger.warn(`There is no pattern preset generator for "${preset}"`);
                    return "";
            }
        }

        const min = getValidator(MinimumLengthValidator).getValue(1);
        const max = getValidator(MaximumLengthValidator).getValue(25);
        const value = faker.lorem.words({
            min,
            max
        });

        return value.length > max ? value.slice(0, max) : value;
    }
}

class MultiLongTextGenerator extends BaseMultiGenerator<string> {
    public type = "long-text";

    public async generate(params: IGeneratorGenerateParams): Promise<string[]> {
        const { getValidator, field } = params;
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return this.iterate(total, async () => {
            return this.getGenerator(LongTextGenerator).generate(field);
        });
    }
}

registry.registerGenerator(LongTextGenerator);
registry.registerGenerator(MultiLongTextGenerator);
