import { faker } from "@faker-js/faker";
import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";

class LongTextGenerator extends BaseGenerator<string> {
    public type = "long-text";
    public multipleValues = false;

    public generate({ getValidator }: IGeneratorGenerateParams): string {
        const min = getValidator(MinimumLengthValidator).getValue(1);
        const max = getValidator(MaximumLengthValidator).getValue(5);
        const value = faker.lorem.words({
            min,
            max
        });

        return value.length > max ? value.slice(0, max) : value;
    }
}

class MultiLongTextGenerator extends BaseGenerator<string[]> {
    public type = "long-text";
    public multipleValues = true;

    public generate(params: IGeneratorGenerateParams): string[] {
        const { getValidator, field } = params;
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return this.getGenerator(LongTextGenerator).generate(field);
            });
    }
}

registry.registerGenerator(LongTextGenerator);
registry.registerGenerator(MultiLongTextGenerator);
