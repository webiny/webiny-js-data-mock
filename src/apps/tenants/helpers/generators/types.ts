import { ApiCmsModelField } from "~/types";

export interface IRegistryGetGeneratorParams {
    type: string;
    multipleValues: boolean;
}

export interface IRegistryRegisterGeneratorCbParams {
    getGenerator<T>(type: { new (params: IRegistryRegisterGeneratorCbParams): T }): T;
    getGeneratorByField<T>(field: ApiCmsModelField): IGenerator<T>;
}

export interface IRegistryRegisterGeneratorCb {
    new (params: IRegistryRegisterGeneratorCbParams): IGenerator;
}

export interface IRegistry {
    registerGenerator(generator: IRegistryRegisterGeneratorCb): void;
    getGenerator<T>(params: IRegistryGetGeneratorParams): IGenerator<T>;
}

export interface IGenerator<T = unknown> {
    type: string;
    multipleValues: boolean;
    generate(field: ApiCmsModelField): T;
}
