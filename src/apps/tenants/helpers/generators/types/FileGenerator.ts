import { faker } from "@faker-js/faker";
import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";

class FileGenerator extends BaseGenerator<string> {
    public type = "file";
    public multipleValues = false;

    public generate(): string {
        return faker.internet.url({
            protocol: "https"
        });
    }
}

class MultiFileGenerator extends BaseGenerator<string[]> {
    public type = "file";
    public multipleValues = true;

    public generate(): string[] {
        const total = faker.number.int({
            min: 1,
            max: 5
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return faker.internet.url({
                    protocol: "https"
                });
            });
    }
}

registry.registerGenerator(FileGenerator);
registry.registerGenerator(MultiFileGenerator);
