import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import { GenericRecord } from "~/types";
import { faker } from "@faker-js/faker";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";

class ObjectGenerator extends BaseGenerator<GenericRecord> {
    public type = "object";
    public multipleValues = false;

    public async generate({ field }: IGeneratorGenerateParams): Promise<GenericRecord | null> {
        const fields = field.settings?.fields;
        if (!fields?.length) {
            return null;
        }
        const values: GenericRecord = {};
        for (const field of fields) {
            const generator = this.getGeneratorByField(field);

            values[field.fieldId] = await generator.generate(field);
        }
        return values;
    }
}

class MultiObjectGenerator extends BaseMultiGenerator<GenericRecord> {
    public type = "object";
    public multipleValues = true;

    public async generate({
        field,
        getValidator
    }: IGeneratorGenerateParams): Promise<GenericRecord[] | null> {
        const fields = field.settings?.fields;
        if (!fields?.length) {
            return null;
        }
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return this.iterate(total, async () => {
            const values: GenericRecord = {};
            for (const field of fields) {
                const generator = this.getGeneratorByField(field);

                values[field.fieldId] = await generator.generate(field);
            }
            return values;
        });
    }
}

registry.registerGenerator(ObjectGenerator);
registry.registerGenerator(MultiObjectGenerator);
