import { faker } from "@faker-js/faker";
import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";

class TextGenerator extends BaseGenerator<string> {
    public type = "text";
    public multipleValues = false;

    public generate(params: IGeneratorGenerateParams): string {
        const { field, getValidator } = params;

        const values = field.predefinedValues?.values;
        if (values?.length) {
            const target = faker.number.int({
                min: 0,
                max: values.length - 1
            });
            return values[target].value;
        }
        const options = {
            min: getValidator(MinimumLengthValidator).getValue(1),
            max: getValidator(MaximumLengthValidator).getValue(3)
        };

        const value = faker.lorem.words(options);

        return value.length > options.max ? value.slice(0, options.max) : value;
    }
}

class MultiTextGenerator extends BaseGenerator<string[]> {
    public type = "text";
    public multipleValues = true;

    public generate(params: IGeneratorGenerateParams): string[] {
        const { field, getValidator } = params;

        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(2)
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return this.getGenerator(TextGenerator).generate(field);
            });
    }
}

registry.registerGenerator(TextGenerator);
registry.registerGenerator(MultiTextGenerator);
