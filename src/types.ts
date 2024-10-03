import {
    CmsGroup as BaseGroup,
    CmsModel as BaseModel,
    CmsModelField as BaseCmsModelField
} from "@webiny/api-headless-cms/types";
import {
    CreateFolderParams as AcoFolderCreateParams,
    Folder as AcoFolder
} from "@webiny/api-aco/types";
import { Page as PbPage } from "@webiny/api-page-builder/types";
import { PbUpdatePageInput as BasePbUpdatePageInput } from "@webiny/api-page-builder/graphql/types";
import { ICache } from "~/cache";

export type GenericRecordKey = string | number | symbol;
// eslint-disable-next-line
export type GenericRecord<K extends GenericRecordKey = GenericRecordKey, V = any> = Record<K, V>;

export type { PbPage };

export interface IApplication {
    run(): Promise<void>;
}

/**
 * GraphQL
 */

export interface ApiCmsMeta {
    totalCount: number;
    hasMoreItems: boolean;
    cursor: string | null;
}

export interface ApiGraphQLSuccessResult<T> {
    data: T;
    meta?: ApiCmsMeta | null;
    error?: never;
    extensions?: GenericRecord[];
}

export interface ApiGraphQLErrorResult {
    data?: never | null;
    error: ApiError;
    extensions?: GenericRecord[];
}

export type ApiGraphQLResult<T> = ApiGraphQLSuccessResult<T> | ApiGraphQLErrorResult;

export interface IGraphQLApplicationGetResult<T> {
    (json: ApiGraphQLResultJson): ApiGraphQLResult<T>;
}

export interface ApiGraphQLResultJson {
    data: GenericRecord;
    meta?: ApiCmsMeta;
    errors?: GenericRecord[];
    extensions?: GenericRecord[];
}

export interface IGraphQLApplicationQueryParams<T> {
    query: string;
    path: `/cms/manage/${string}-${Uppercase<string>}` | "/graphql";
    variables?: GenericRecord;
    getResult: IGraphQLApplicationGetResult<T>;
}

export interface IGraphQLApplicationMutationParams<T> {
    mutation: string;
    path: `/cms/manage/${string}-${Uppercase<string>}` | "/graphql";
    variables: GenericRecord;
    getResult: IGraphQLApplicationGetResult<T>;
}

export interface IGraphQLApplicationMutationsParams<T> {
    mutation: string;
    path: `/cms/manage/${string}-${Uppercase<string>}` | "/graphql";
    variables: GenericRecord[];
    getResult: IGraphQLApplicationGetResult<T>;
    atOnce?: number;
}

export interface IGraphQLApplication {
    setTenant(tenant: string): void;
    query<T>(params: IGraphQLApplicationQueryParams<T>): Promise<ApiGraphQLResult<T>>;
    mutation<T>(params: IGraphQLApplicationMutationParams<T>): Promise<ApiGraphQLResult<T>>;
    mutations<T>(params: IGraphQLApplicationMutationsParams<T>): Promise<ApiGraphQLResult<T>[]>;
}

/**
 * Group
 */
export interface IGroupApplication extends IApplication {
    getGroups(): ApiCmsGroup[];
}

/**
 * Model
 */
export interface IModelApplication extends IApplication {
    getModels(): ApiCmsModel[];
    getModel(id: string): ApiCmsModel;
    fetch(modelId: string): Promise<ApiCmsModel>;
}

/**
 * Entry
 */
export type IEntryRunnerResponse<T> = T & {
    total: number;
    errors: ApiError[];
};

export interface IEntryRunner<T = GenericRecord> {
    id: string;
    name: string;
    exec(): Promise<IEntryRunnerResponse<T>>;
}

export interface IEntryRunnerFactory<T = GenericRecord> {
    (app: IBaseApplication): IEntryRunner<T>;
}

export interface IEntryApplicationCreateViaGraphQLResponse<T> {
    entries: T[];
    errors: ApiError[];
}

export interface IEntryApplicationCreateViaGraphQLParamsOptions {
    skipValidators?: string[];
}

export interface IEntryApplicationCreateViaGraphQLParams {
    model: ApiCmsModel;
    variables: GenericRecord[];
    atOnce?: number;
    options?: IEntryApplicationCreateViaGraphQLParamsOptions;
}

export interface IEntryApplication extends IApplication {
    getEntries: (name: string) => CmsEntry[];
    createViaGraphQL<T>(
        params: IEntryApplicationCreateViaGraphQLParams
    ): Promise<IEntryApplicationCreateViaGraphQLResponse<T>>;
}

/**
 * Page
 */

export interface IPageRunnerResponse {
    pages: PbPage[];
    total: number;
    errors: ApiError[];
}

export interface IPageRunner {
    id: string;
    name: string;
    exec(): Promise<IPageRunnerResponse>;
}

export interface IPageRunnerFactory {
    (app: IBaseApplication): IPageRunner;
}

export interface PbPageInput
    extends Omit<BasePbUpdatePageInput, "title" | "category">,
        Required<Pick<BasePbUpdatePageInput, "title" | "category">> {
    slug: string;
}

export interface IPageApplication extends IApplication {
    getPages(): PbPage[];
    createViaGraphQL(data: PbPageInput): Promise<PbPage>;
}

/**
 * Folders
 */
export type { AcoFolderCreateParams };

export type { AcoFolder };

export interface IFolderApplicationCreateViaGraphQLResponse {
    folders: AcoFolder[];
    errors: ApiError[];
}

export type IFolderRunnerResponse = {
    folders: AcoFolder[];
    total: number;
    errors: ApiError[];
};

export interface IFolderRunner {
    id: string;
    name: string;
    exec(): Promise<IFolderRunnerResponse>;
}

export interface IFolderRunnerFactory {
    (app: IBaseApplication): IFolderRunner;
}

export interface IFolderApplication extends IApplication {
    getFolders: (app: string | null) => AcoFolder[];
    createViaGraphQL(
        variables: AcoFolderCreateParams[],
        atOnce?: number
    ): Promise<IFolderApplicationCreateViaGraphQLResponse>;
}

/**
 * Fetcher
 */
export type IFetchEntriesApplication = IApplication;

/**
 * Base
 */
export interface IBaseApplication {
    run(): Promise<void>;
    getBooleanArg: (name: string, def: boolean) => boolean;
    getNumberArg: (name: string, def: number) => number;
    getStringArg: (name: string, def: string) => string;
    getApp: <T>(name: string) => T;
    graphql: IGraphQLApplication;
    cache: ICache;
}

export type ApiCmsGroup = Pick<BaseGroup, "id" | "name" | "slug">;

export type ApiCmsModelField = Pick<
    BaseCmsModelField,
    | "id"
    | "fieldId"
    | "storageId"
    | "type"
    | "multipleValues"
    | "settings"
    | "predefinedValues"
    | "validation"
    | "listValidation"
>;

export interface ApiCmsModel
    extends Pick<BaseModel, "name" | "modelId" | "singularApiName" | "pluralApiName"> {
    fields: ApiCmsModelField[];
}

export interface ApiError {
    message: string;
    code: string;
    data?: GenericRecord | null;
}

/**
 * CMS entries
 *
 * @blog
 */
export interface CmsEntry {
    id: string;
    entryId: string;
}

export interface ApiCmsCategory extends CmsEntry {
    title: string;
}

export interface ApiCmsAuthor extends CmsEntry {
    name: string;
    dateOfBirth: string;
}

export interface ApiCmsRef {
    id: string;
    modelId: string;
}

export interface ApiCmsArticle extends CmsEntry {
    title: string;
    description: string;
    body: GenericRecord;
    author: ApiCmsRef;
    categories: ApiCmsRef[];
}

/**
 * @cars
 */
export interface ApiCmsSimpleCarMake extends CmsEntry {
    name: string;
}
export interface ApiCmsSimpleCarModel extends CmsEntry {
    name: string;
    make: ApiCmsRef;
}
