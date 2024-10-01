import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import { GenericRecord } from "~/types";
import { faker } from "@faker-js/faker";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";

class ObjectGenerator extends BaseGenerator<GenericRecord | null> {
    public type = "object";
    public multipleValues = false;

    public generate({ field }: IGeneratorGenerateParams): GenericRecord | null {
        const fields = field.settings?.fields;
        if (!fields?.length) {
            return null;
        }
        return fields.reduce<GenericRecord>((values, field) => {
            const generator = this.getGeneratorByField(field);

            values[field.fieldId] = generator.generate(field);
            return values;
        }, {});
    }
}

class MultiObjectGenerator extends BaseGenerator<GenericRecord[]> {
    public type = "object";
    public multipleValues = true;

    public generate({ field, getValidator }: IGeneratorGenerateParams): GenericRecord[] {
        const fields = field.settings?.fields;
        if (!fields?.length) {
            return [];
        }
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return fields.reduce<GenericRecord>((values, field) => {
                    const generator = this.getGeneratorByField(field);

                    values[field.fieldId] = generator.generate(field);
                    return values;
                }, {});
            });
    }
}

registry.registerGenerator(ObjectGenerator);
registry.registerGenerator(MultiObjectGenerator);
