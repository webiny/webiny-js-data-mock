import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import { faker } from "@faker-js/faker";
import { registry } from "../registry";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";
import { LesserThanOrEqualDateValidator } from "~/apps/tenants/helpers/generators/validators/LesserThanOrEqualDateValidator";
import { GreaterThanOrEqualDateValidator } from "~/apps/tenants/helpers/generators/validators/GreaterThanOrEqualDateValidator";
import { createTime } from "./date/createTime";
import { createDate } from "./date/createDate";
import { createDateTimeWithoutTimezone } from "~/apps/tenants/helpers/generators/fields/date/createDateTimeWithoutTimezone";
import { createDateTimeWithTimezone } from "~/apps/tenants/helpers/generators/fields/date/createDateTimeWithTimezone";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";

const createValue = (params: IGeneratorGenerateParams): string => {
    const { field, getValidator } = params;

    const gteValidator = getValidator(GreaterThanOrEqualDateValidator);
    const lteValidator = getValidator(LesserThanOrEqualDateValidator);
    const settings = field.settings || {};
    if (settings.type === "time") {
        return createTime({
            gteValidator,
            lteValidator
        });
    } else if (settings.type === "date") {
        return createDate({
            gteValidator,
            lteValidator
        });
    } else if (settings.type === "dateTimeWithoutTimezone") {
        return createDateTimeWithoutTimezone({
            gteValidator,
            lteValidator
        });
    } else if (settings.type === "dateTimeWithTimezone") {
        return createDateTimeWithTimezone({
            gteValidator,
            lteValidator
        });
    }
    return faker.date.anytime().toISOString();
};

class DateTimeGenerator extends BaseGenerator<string> {
    public readonly type: string = "datetime";
    public multipleValues = false;

    public async generate(params: IGeneratorGenerateParams): Promise<string> {
        return createValue(params);
    }
}

class MultiDateTimeGenerator extends BaseMultiGenerator<string> {
    public readonly type: string = "datetime";
    public readonly multipleValues = true;

    public async generate(params: IGeneratorGenerateParams): Promise<string[]> {
        const { getValidator } = params;
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return this.iterate(total, async () => {
            return createValue(params);
        });
    }
}

registry.registerGenerator(DateTimeGenerator);
registry.registerGenerator(MultiDateTimeGenerator);
