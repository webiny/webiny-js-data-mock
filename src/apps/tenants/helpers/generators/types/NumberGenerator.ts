import { registry } from "../registry";
import { BaseGenerator } from "./BaseGenerator";
import { faker } from "@faker-js/faker";
import { ApiCmsModelField } from "~/types";

class NumberGenerator extends BaseGenerator<number> {
    public type = "number";
    public multipleValues = false;

    public generate(field: ApiCmsModelField): number {
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

class MultiNumberGenerator extends BaseGenerator<number[]> {
    public type = "number";
    public multipleValues = true;

    public generate(field: ApiCmsModelField): number[] {
        const values = field.predefinedValues?.values;
        if (values?.length) {
            const target = faker.number.int({
                min: 0,
                max: values.length - 1
            });
            return [Number(values[target].value)];
        }
        const total = faker.number.int({
            min: 1,
            max: 5
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return faker.number.int({
                    min: 1,
                    max: 100
                });
            });
    }
}

registry.registerGenerator(NumberGenerator);
registry.registerGenerator(MultiNumberGenerator);
