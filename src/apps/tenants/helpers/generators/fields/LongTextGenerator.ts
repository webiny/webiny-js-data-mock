import { faker } from "@faker-js/faker";
import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";

class LongTextGenerator extends BaseGenerator<string> {
    public type = "long-text";
    public multipleValues = false;

    public async generate({ getValidator }: IGeneratorGenerateParams): Promise<string> {
        const min = getValidator(MinimumLengthValidator).getValue(1);
        const max = getValidator(MaximumLengthValidator).getValue(5);
        const value = faker.lorem.words({
            min,
            max
        });

        return value.length > max ? value.slice(0, max) : value;
    }
}

class MultiLongTextGenerator extends BaseMultiGenerator<string> {
    public type = "long-text";
    public multipleValues = true;

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
