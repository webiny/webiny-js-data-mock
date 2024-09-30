import { faker } from "@faker-js/faker";
import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";

class LongTextGenerator extends BaseGenerator<string> {
    public type = "long-text";
    public multipleValues = false;

    public generate(): string {
        return faker.lorem.paragraph();
    }
}

class MultiLongTextGenerator extends BaseGenerator<string[]> {
    public type = "long-text";
    public multipleValues = true;

    public generate(): string[] {
        const total = faker.number.int({
            min: 1,
            max: 5
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return faker.lorem.paragraph();
            });
    }
}

registry.registerGenerator(LongTextGenerator);
registry.registerGenerator(MultiLongTextGenerator);
