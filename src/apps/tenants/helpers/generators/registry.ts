import {
    IGenerator,
    IRegistry,
    IRegistryGenerator,
    IRegistryGetGeneratorParams,
    IRegistryRegisterGeneratorCb,
    IValidator,
    IValidatorConstructor
} from "./types";
import { ApiCmsModelField } from "~/types";

class Registry implements IRegistry {
    public generators: IGenerator[] = [];
    public validators: IValidatorConstructor<unknown>[] = [];

    public registerValidator<T>(validator: IValidatorConstructor<T>): void {
        this.validators.push(validator);
    }

    public registerGenerator(cb: IRegistryRegisterGeneratorCb): void {
        const generator = new cb({
            getGenerator: <T>(type: { new (): T }): T => {
                for (const generator of this.generators) {
                    if (generator instanceof type) {
                        return generator;
                    }
                }
                throw new Error(`Generator for type "${type}" not found!`);
            },
            getGeneratorByField: <T>(field: ApiCmsModelField): IRegistryGenerator<T> => {
                return this.getGenerator<T>({
                    type: field.type,
                    multipleValues: !!field.multipleValues
                });
            }
        });
        this.generators.push(generator);
    }

    public getGenerator<T>(params: IRegistryGetGeneratorParams): IRegistryGenerator<T> {
        const { type, multipleValues } = params;

        const generator = this.generators.find(generator => {
            return generator.type === type && generator.multipleValues === multipleValues;
        }) as IGenerator<T> | undefined;
        if (!generator) {
            this.generators.map(generator => {
                return {
                    type: generator.type,
                    multipleValues: generator.multipleValues
                };
            });

            throw new Error(
                `Generator for type "${type}", multiple values "${multipleValues ? "true" : "false"}" not found!`
            );
        }
        return {
            generate: (field: ApiCmsModelField): T => {
                return generator.generate({
                    field,
                    getValidator: <V>(type: IValidatorConstructor<V>): IValidator<V> => {
                        return this.getValidator(field, type);
                    }
                });
            }
        };
    }

    public getValidator<V>(field: ApiCmsModelField, type: IValidatorConstructor<V>): IValidator<V> {
        return new type(field);
    }
}

export type { Registry };

export const registry = new Registry();
