import { BaseGenerator } from "./BaseGenerator";
import { ApiCmsModelField } from "~/types";
import { faker } from "@faker-js/faker";
import { registry } from "../registry";

const withTimezone = () => {
    const value = faker.date.past().toISOString();

    const [date, timeAndTimezone] = value.split("T");
    const [time] = timeAndTimezone.split(".");

    return `${date}T${time}+01:00`;
};

const create = (field: Pick<ApiCmsModelField, "settings">): string => {
    const type = field.settings?.type;
    switch (type) {
        case "time":
            return faker.date.past().toISOString().substring(11, 19);
        case "dateTimeWithTimezone":
            return withTimezone();
        case "dateTimeWithoutTimezone":
            return faker.date.past().toISOString();
        case "date":
            return faker.date.past().toISOString().substring(0, 10);
        default:
            throw new Error(`Unknown date type: ${type}`);
    }
};

class DateTimeGenerator extends BaseGenerator<string> {
    public type = "datetime";
    public multipleValues = false;

    public generate(field: ApiCmsModelField): string {
        return create(field);
    }
}

class MultiDateTimeGenerator extends BaseGenerator<string[]> {
    public type = "datetime";
    public multipleValues = true;

    public generate(field: ApiCmsModelField): string[] {
        const total = faker.number.int({
            min: 1,
            max: 5
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return create(field);
            });
    }
}

registry.registerGenerator(DateTimeGenerator);
registry.registerGenerator(MultiDateTimeGenerator);
