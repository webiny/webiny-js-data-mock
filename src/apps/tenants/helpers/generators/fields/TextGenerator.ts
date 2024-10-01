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
        return faker.lorem.words({
            min: getValidator(MinimumLengthValidator).getValue(1),
            max: getValidator(MaximumLengthValidator).getValue(3)
        });
    }
}

class MultiTextGenerator extends BaseGenerator<string[]> {
    public type = "text";
    public multipleValues = true;

    public generate(params: IGeneratorGenerateParams): string[] {
        const { field, getValidator } = params;
        const values = field.predefinedValues?.values;
        if (values?.length) {
            const target = faker.number.int({
                min: 0,
                max: values.length - 1
            });
            return [values[target].value];
        }

        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return faker.lorem.words({
                    min: getValidator(MinimumLengthValidator).getValue(1),
                    max: getValidator(MaximumLengthValidator).getValue(3)
                });
            });
    }
}

registry.registerGenerator(TextGenerator);
registry.registerGenerator(MultiTextGenerator);
