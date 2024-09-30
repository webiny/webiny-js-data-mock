import { IGenerator, IRegistryRegisterGeneratorCbParams } from "../types";
import { ApiCmsModelField } from "~/types";

export interface IBaseGeneratorParams extends IRegistryRegisterGeneratorCbParams {}

export abstract class BaseGenerator<T = unknown> implements IGenerator<T> {
    public abstract type: string;
    public abstract multipleValues: boolean;

    protected readonly getGenerator: <T>(type: { new (params: IBaseGeneratorParams): T }) => T;
    protected readonly getGeneratorByField: <T = unknown>(field: ApiCmsModelField) => IGenerator<T>;

    public constructor(params: IBaseGeneratorParams) {
        this.getGenerator = params.getGenerator;
        this.getGeneratorByField = params.getGeneratorByField;
    }

    public abstract generate(field: ApiCmsModelField): T;
}
