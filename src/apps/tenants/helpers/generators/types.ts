import { ApiCmsModelField, GenericRecord } from "~/types";

export interface IRegistryGetGeneratorParams {
    type: string;
    multipleValues: boolean;
}

export interface IRegistryRegisterGeneratorCbParams {
    getGenerator<T>(type: { new (params: IRegistryRegisterGeneratorCbParams): T }): T;
    getGeneratorByField<T>(field: ApiCmsModelField): IRegistryGenerator<T>;
}

export interface IRegistryRegisterGeneratorCb {
    new (params: IRegistryRegisterGeneratorCbParams): IGenerator;
}

export interface IRegistry {
    registerGenerator(generator: IRegistryRegisterGeneratorCb): void;
    getGenerator<T>(params: IRegistryGetGeneratorParams): IRegistryGenerator<T>;
    registerValidator<T>(validator: IValidatorConstructor<T>): void;
}

export interface IGetValidator {
    <T>(type: { new (field: ApiCmsModelField): IValidator<T> }): IValidator<T>;
}

export interface IGeneratorGenerateParams {
    field: ApiCmsModelField;
    getValidator: IGetValidator;
}
export interface IGenerator<T = unknown> {
    type: string;
    multipleValues: boolean;
    generate(params: IGeneratorGenerateParams): T;
}

export interface IRegistryGenerator<T = unknown> {
    generate(field: ApiCmsModelField): T;
}

export interface IValidatorConstructor<T> {
    new (field: ApiCmsModelField): IValidator<T>;
}

export interface IValidation<T = GenericRecord> {
    name: string;
    message: string;
    settings?: T;
}

export interface IValidator<T> {
    field: ApiCmsModelField;
    getValue(def?: T): T;
    getListValue(def?: T): T;
    getValidation<S>(name: string): IValidation<S> | null;
    getListValidation<S>(name: string): IValidation<S> | null;
}
