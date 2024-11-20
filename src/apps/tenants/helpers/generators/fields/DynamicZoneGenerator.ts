import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import pMap from "p-map";
import { registry } from "../registry";
import { ApiCmsModelDynamicZoneField, GenericRecord } from "~/types";
import { IGeneratorGenerateParams } from "~/apps/tenants/helpers/generators/types";
import { faker } from "@faker-js/faker";
import {
    MaximumLengthValidator,
    MinimumLengthValidator
} from "~/apps/tenants/helpers/generators/validators";

class DynamicZoneGenerator extends BaseGenerator<GenericRecord> {
    public type = "dynamicZone";

    public async generate(
        params: IGeneratorGenerateParams<ApiCmsModelDynamicZoneField>
    ): Promise<GenericRecord | null> {
        return pMap(params.field.settings.templates, async template => {
            const values: GenericRecord = {};
            for (const field of template.fields) {
                const generator = this.getGeneratorByField(field);
                values[field.fieldId] = await generator.generate();
            }
            return {
                [template.gqlTypeName]: values
            };
        });
    }
}

class MultiDynamicZoneGenerator extends BaseMultiGenerator<GenericRecord> {
    public type = "dynamicZone";

    public async generate(
        params: IGeneratorGenerateParams<ApiCmsModelDynamicZoneField>
    ): Promise<GenericRecord[]> {
        const { field, getValidator } = params;
        const total = faker.number.int({
            min: getValidator(MinimumLengthValidator).getListValue(1),
            max: getValidator(MaximumLengthValidator).getListValue(5)
        });
        return this.iterate(total, async () => {
            return await this.getGenerator(DynamicZoneGenerator).generate(field);
        });
    }
}

registry.registerGenerator(DynamicZoneGenerator);
registry.registerGenerator(MultiDynamicZoneGenerator);
