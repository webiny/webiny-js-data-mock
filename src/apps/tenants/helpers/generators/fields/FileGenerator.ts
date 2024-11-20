import { faker } from "@faker-js/faker";
import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";

class FileGenerator extends BaseGenerator<string> {
    public type = "file";

    public async generate(): Promise<string> {
        return faker.internet.url({
            protocol: "https"
        });
    }
}

class MultiFileGenerator extends BaseMultiGenerator<string> {
    public type = "file";

    public async generate({ getValidator }: IGeneratorGenerateParams): Promise<string[]> {
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return this.iterate(total, async () => {
            return faker.internet.url({
                protocol: "https"
            });
        });
    }
}

registry.registerGenerator(FileGenerator);
registry.registerGenerator(MultiFileGenerator);
