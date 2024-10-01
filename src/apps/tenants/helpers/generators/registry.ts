import {
    IGenerator,
    IRegistry,
    IRegistryGenerator,
    IRegistryGetGeneratorParams,
    IRegistryRegisterGeneratorConstructor,
    IValidator,
    IValidatorConstructor
} from "./types";
import { ApiCmsModelField } from "~/types";

class Registry implements IRegistry {
    public generators: IGenerator<unknown>[] = [];
    public validators: IValidatorConstructor<unknown>[] = [];

    public registerValidator<T>(validator: IValidatorConstructor<T>): void {
        this.validators.push(validator);
    }

    public registerGenerator(generatorConstructor: IRegistryRegisterGeneratorConstructor): void {
        const generator = new generatorConstructor({
            getGenerator: <T extends IGenerator<unknown>>(type: {
                new (): T;
            }): IRegistryGenerator<T> => {
                for (const generator of this.generators) {
                    if (generator instanceof type) {
                        return this.createRegistryGenerator<T>(generator);
                    }
                }
                throw new Error(`Generator for type "${type}" not found!`);
            },
            getGeneratorByField: <T extends IGenerator<unknown>>(
                field: ApiCmsModelField
            ): IRegistryGenerator<T> => {
                return this.getGenerator<T>({
                    type: field.type,
                    multipleValues: !!field.multipleValues
                });
            }
        });
        this.generators.push(generator);
    }

    public getGenerator<T extends IGenerator<unknown>>(
        params: IRegistryGetGeneratorParams
    ): IRegistryGenerator<T> {
        const { type, multipleValues } = params;

        const generator = this.generators.find(generator => {
            return generator.type === type && generator.multipleValues === multipleValues;
        }) as T | undefined;
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
        return this.createRegistryGenerator<T>(generator);
    }

    public getValidator<V>(field: ApiCmsModelField, type: IValidatorConstructor<V>): IValidator<V> {
        return new type(field);
    }

    private createRegistryGenerator<T extends IGenerator<unknown>>(generator: T) {
        return {
            generate: (field: ApiCmsModelField): ReturnType<T["generate"]> => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return generator.generate({
                    field,
                    getValidator: <V>(type: IValidatorConstructor<V>): IValidator<V> => {
                        return this.getValidator(field, type);
                    }
                });
            }
        };
    }
}

export type { Registry };

export const registry = new Registry();
