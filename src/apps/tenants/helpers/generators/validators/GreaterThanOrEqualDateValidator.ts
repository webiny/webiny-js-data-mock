import { BaseValidator } from "./BaseValidator";
import { registry } from "~/apps/tenants/helpers/generators/registry";
import { DateValidationSettings } from "./types";

export class GreaterThanOrEqualDateValidator extends BaseValidator<string | undefined> {
    public getValue(def?: string): string | undefined {
        const validation = this.getValidation<DateValidationSettings>("dateGte");
        if (validation?.settings?.value !== undefined) {
            return validation.settings.value;
        } else if (def !== undefined) {
            return def;
        }
        return undefined;
    }

    public getListValue(def?: string): string | undefined {
        const validation = this.getListValidation<DateValidationSettings>("dateGte");
        if (validation?.settings?.value !== undefined) {
            return validation.settings.value;
        } else if (def !== undefined) {
            return def;
        }
        return undefined;
    }
}

registry.registerValidator(GreaterThanOrEqualDateValidator);
