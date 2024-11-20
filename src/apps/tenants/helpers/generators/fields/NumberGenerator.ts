import { registry } from "../registry";
import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import { faker } from "@faker-js/faker";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";

class NumberGenerator extends BaseGenerator<number> {
    public type = "number";

    public async generate({ field }: IGeneratorGenerateParams): Promise<number> {
        const values = field.predefinedValues?.values;
        if (values?.length) {
            const target = faker.number.int({
                min: 0,
                max: values.length - 1
            });
            return Number(values[target].value);
        }
        return faker.number.int({
            min: 1,
            max: 100
        });
    }
}

class MultiNumberGenerator extends BaseMultiGenerator<number> {
    public type = "number";

    public async generate({ field, getValidator }: IGeneratorGenerateParams): Promise<number[]> {
        const values = field.predefinedValues?.values;
        if (values?.length) {
            const target = faker.number.int({
                min: 0,
                max: values.length - 1
            });
            return [Number(values[target].value)];
        }
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return this.iterate(total, async () => {
            return faker.number.int({
                min: 1,
                max: 100
            });
        });
    }
}

registry.registerGenerator(NumberGenerator);
registry.registerGenerator(MultiNumberGenerator);
