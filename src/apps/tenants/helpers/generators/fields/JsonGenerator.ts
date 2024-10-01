import { BaseGenerator } from "./BaseGenerator";
import { GenericRecord } from "~/types";
import { faker } from "@faker-js/faker";
import { registry } from "../registry";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";

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

    public generate({ getValidator }: IGeneratorGenerateParams): GenericRecord[] {
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
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
