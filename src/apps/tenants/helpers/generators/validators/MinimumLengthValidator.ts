import { BaseValidator } from "./BaseValidator";
import { registry } from "~/apps/tenants/helpers/generators/registry";
import { LengthValidationSettings } from "~/apps/tenants/helpers/generators/validators/types";

export class MinimumLengthValidator extends BaseValidator<number> {
    public getValue(def: number): number {
        const validation = this.getValidation<LengthValidationSettings>("minLength");

        if (validation?.settings?.value === undefined) {
            return def;
        }
        const value = Number(validation.settings.value);
        return isNaN(value) ? def : value;
    }

    public getListValue(def: number): number {
        const validation = this.getListValidation<LengthValidationSettings>("minLength");
        if (validation?.settings?.value === undefined) {
            return def;
        }
        const value = Number(validation.settings.value);
        return isNaN(value) ? def : value;
    }
}

registry.registerValidator(MinimumLengthValidator);