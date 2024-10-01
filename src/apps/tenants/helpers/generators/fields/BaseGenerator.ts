import {
    IGenerator,
    IGeneratorGenerateParams,
    IRegistryGenerator,
    IRegistryRegisterGeneratorConstructorParams
} from "../types";
import { ApiCmsModelField } from "~/types";

export type IBaseGeneratorParams = IRegistryRegisterGeneratorConstructorParams;

export abstract class BaseGenerator<T = unknown> implements IGenerator<T> {
    public abstract readonly type: string;
    public abstract readonly multipleValues: boolean;

    protected readonly getGenerator: <T extends IGenerator<unknown>>(type: {
        new (params: IBaseGeneratorParams): T;
    }) => IRegistryGenerator<T>;
    protected readonly getGeneratorByField: <T extends IGenerator<unknown>>(
        field: ApiCmsModelField
    ) => IRegistryGenerator<T>;

    public constructor(params: IBaseGeneratorParams) {
        this.getGenerator = params.getGenerator;
        this.getGeneratorByField = params.getGeneratorByField;
    }

    public abstract generate(params: IGeneratorGenerateParams): T;
}
