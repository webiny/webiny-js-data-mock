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
import { logger } from "~/logger";

class Registry implements IRegistry {
    public generators: IGenerator<unknown>[] = [];
    public validators: IValidatorConstructor<unknown>[] = [];
    private readonly validatorsCache: Map<string, IValidator<unknown>> = new Map();

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
                const name = type.constructor?.name || type.name || type || typeof type;
                throw new Error(`Generator for type "${name}" not found!`);
            },
            getGeneratorByField: <T extends IGenerator<unknown>>(
                field: ApiCmsModelField
            ): IRegistryGenerator<T> => {
                return this.getGenerator<T>({
                    field
                });
            }
        });
        this.generators.push(generator);
    }

    public getGenerator<T extends IGenerator<unknown>>(
        params: IRegistryGetGeneratorParams
    ): IRegistryGenerator<T> {
        const { field } = params;

        const type = field.type;
        const multipleValues = !!field.multipleValues;

        const generator = this.generators.find(generator => {
            return generator.type === type && generator.multipleValues === multipleValues;
        }) as T | undefined;
        if (!generator) {
            logger.error(
                `Generator for type "${type}", multiple values "${multipleValues ? "true" : "false"}" not found! Skipping...`
            );
            return this.getNullGenerator();
        }
        return this.createRegistryGenerator<T>(generator);
    }

    private getValidator<V>(
        field: ApiCmsModelField,
        validatorConstructor: IValidatorConstructor<V>
    ): IValidator<V> {
        const type = [
            field.id,
            field.fieldId,
            field.type,
            field.storageId,
            validatorConstructor.name
        ].join("#");

        if (this.validatorsCache.has(type)) {
            return this.validatorsCache.get(type) as IValidator<V>;
        }
        const validator = new validatorConstructor(field);
        this.validatorsCache.set(type, validator);
        return validator;
    }

    private createRegistryGenerator<T extends IGenerator<unknown>>(generator: T) {
        return {
            generate: (field: ApiCmsModelField): ReturnType<T["generate"]> => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return generator.generate({
                    field,
                    getValidator: <V>(
                        validatorConstructor: IValidatorConstructor<V>
                    ): IValidator<V> => {
                        return this.getValidator(field, validatorConstructor);
                    }
                });
            }
        };
    }

    private getNullGenerator(): IRegistryGenerator<IGenerator<unknown>> {
        return {
            generate: async () => null
        };
    }
}

export type { Registry };

export const registry = new Registry();
