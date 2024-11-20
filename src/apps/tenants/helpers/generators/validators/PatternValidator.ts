import { BaseValidator } from "~/apps/tenants/helpers/generators/validators/BaseValidator";
import { PatternValidationSettings } from "~/apps/tenants/helpers/generators/validators/types";
import { registry } from "~/apps/tenants/helpers/generators/registry";

export class PatternValidator extends BaseValidator<PatternValidationSettings | undefined> {
    public getValue(def?: PatternValidationSettings): PatternValidationSettings | undefined {
        const validation = this.getValidation<PatternValidationSettings>("pattern");

        return validation?.settings || def;
    }
    public getListValue(
        def?: PatternValidationSettings | undefined
    ): PatternValidationSettings | undefined {
        return def;
    }
}

registry.registerValidator(PatternValidator);
