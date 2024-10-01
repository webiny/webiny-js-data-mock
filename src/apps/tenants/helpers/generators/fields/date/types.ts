import { IValidator } from "~/apps/tenants/helpers/generators/types";

export interface IValidatorsParams {
    gteValidator: IValidator<string | undefined>;
    lteValidator: IValidator<string | undefined>;
}
