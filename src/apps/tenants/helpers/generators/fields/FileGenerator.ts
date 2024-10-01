import { faker } from "@faker-js/faker";
import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";

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

    public generate({ getValidator }: IGeneratorGenerateParams): string[] {
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
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
