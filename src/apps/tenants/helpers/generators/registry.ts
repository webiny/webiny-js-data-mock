import {
    IGenerator,
    IRegistry,
    IRegistryGetGeneratorParams,
    IRegistryRegisterGeneratorCb
} from "./types";
import { ApiCmsModelField } from "~/types";

class Registry implements IRegistry {
    public generators: IGenerator[] = [];

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
            getGeneratorByField: <T>(field: ApiCmsModelField): IGenerator<T> => {
                return this.getGenerator<T>({
                    type: field.type,
                    multipleValues: !!field.multipleValues
                });
            }
        });
        this.generators.push(generator);
    }

    public getGenerator<T>(params: IRegistryGetGeneratorParams): IGenerator<T> {
        const { type, multipleValues } = params;

        const generator = this.generators.find(generator => {
            return generator.type === type && generator.multipleValues === multipleValues;
        });
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
        return generator as IGenerator<T>;
    }
}

export type { Registry };

export const registry = new Registry();
