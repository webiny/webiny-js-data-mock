import { faker } from "@faker-js/faker";
import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import { ApiCmsModelField } from "~/types";

class TextGenerator extends BaseGenerator<string> {
    public type = "text";
    public multipleValues = false;

    public generate(field: ApiCmsModelField): string {
        const values = field.predefinedValues?.values;
        if (values?.length) {
            const target = faker.number.int({
                min: 0,
                max: values.length - 1
            });
            return values[target].value;
        }
        return faker.lorem.words({
            min: 1,
            max: 3
        });
    }
}

class MultiTextGenerator extends BaseGenerator<string[]> {
    public type = "text";
    public multipleValues = true;

    public generate(field: ApiCmsModelField): string[] {
        const values = field.predefinedValues?.values;
        if (values?.length) {
            const target = faker.number.int({
                min: 0,
                max: values.length - 1
            });
            return [values[target].value];
        }
        const total = faker.number.int({
            min: 1,
            max: 5
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return faker.lorem.words({
                    min: 1,
                    max: 3
                });
            });
    }
}

registry.registerGenerator(TextGenerator);
registry.registerGenerator(MultiTextGenerator);
