import {
    IGenerator,
    IGeneratorGenerateParams,
    IRegistryGenerator,
    IRegistryRegisterGeneratorCbParams
} from "../types";
import { ApiCmsModelField } from "~/types";

export type IBaseGeneratorParams = IRegistryRegisterGeneratorCbParams;

export abstract class BaseGenerator<T = unknown> implements IGenerator<T> {
    public abstract readonly type: string;
    public abstract readonly multipleValues: boolean;

    protected readonly getGenerator: <T extends IRegistryGenerator>(type: {
        new (params: IBaseGeneratorParams): T;
    }) => T;
    protected readonly getGeneratorByField: <T = unknown>(
        field: ApiCmsModelField
    ) => IRegistryGenerator<T>;

    public constructor(params: IBaseGeneratorParams) {
        this.getGenerator = params.getGenerator;
        this.getGeneratorByField = params.getGeneratorByField;
    }

    public abstract generate(params: IGeneratorGenerateParams): T;
}
