import { BaseGenerator } from "./BaseGenerator";
import { GenericRecord } from "~/types";
import { faker } from "@faker-js/faker";
import { registry } from "../registry";

const create = (): GenericRecord => {
    return {
        name: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        data: {
            key: faker.lorem.word(),
            value: faker.lorem.words(3)
        },
        value: faker.number.int(),
        is_active: faker.number.int() % 2,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.past().toISOString()
    };
};

class JsonGenerator extends BaseGenerator<GenericRecord> {
    public type = "json";
    public multipleValues = false;

    public generate(): GenericRecord {
        return create();
    }
}

class MultiJsonGenerator extends BaseGenerator<GenericRecord[]> {
    public type = "json";
    public multipleValues = true;

    public generate(): GenericRecord[] {
        const total = faker.number.int({
            min: 1,
            max: 5
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return create();
            });
    }
}

registry.registerGenerator(JsonGenerator);
registry.registerGenerator(MultiJsonGenerator);
