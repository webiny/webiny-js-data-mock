import { IValidatorsParams } from "~/apps/tenants/helpers/generators/fields/date/types";
import { faker } from "@faker-js/faker";

const format = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const createDateTimeWithoutTimezone = (params: IValidatorsParams): string => {
    const { gteValidator, lteValidator } = params;

    const refDateTime = faker.date.anytime().toISOString();

    const attachDateTime = (input: string | undefined): string | undefined => {
        if (!input) {
            return undefined;
        }
        return `${input}${refDateTime.substring(10)}`;
    };

    const gteValue = attachDateTime(gteValidator.getValue());
    const lteValue = attachDateTime(lteValidator.getValue());
    if (gteValue && lteValue) {
        return format(
            faker.date.between({
                from: gteValue,
                to: lteValue
            })
        );
    } else if (gteValue) {
        return format(
            faker.date.between({
                from: gteValue,
                to: faker.date.future({
                    refDate: gteValue
                })
            })
        );
    } else if (lteValue) {
        return format(
            faker.date.between({
                from: faker.date.past({
                    refDate: lteValue
                }),
                to: lteValue
            })
        );
    }
    return format(faker.date.anytime());
};
