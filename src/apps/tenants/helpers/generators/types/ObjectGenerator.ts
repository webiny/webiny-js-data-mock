import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import { ApiCmsModelField, GenericRecord } from "~/types";
import { faker } from "@faker-js/faker";

class ObjectGenerator extends BaseGenerator<GenericRecord | null> {
    public type = "object";
    public multipleValues = false;

    public generate(): GenericRecord | null {
        return null;
    }
}

class MultiObjectGenerator extends BaseGenerator<GenericRecord[]> {
    public type = "object";
    public multipleValues = true;

    public generate(field: ApiCmsModelField): GenericRecord[] {
        const fields = field.settings?.fields;
        if (!fields?.length) {
            return [];
        }
        const total = faker.number.int({
            min: 1,
            max: 5
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
