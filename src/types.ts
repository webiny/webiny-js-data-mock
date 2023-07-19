import {
    CmsGroup as BaseGroup,
    CmsModel as BaseModel,
    CmsModelField as BaseCmsModelField
} from "@webiny/api-headless-cms/types";

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
    extensions: any[];
}

export interface ApiGraphQLErrorResult {
    data?: never | null;
    error: ApiCmsError;
    extensions: any[];
}

export type ApiGraphQLResult<T> = ApiGraphQLSuccessResult<T> | ApiGraphQLErrorResult;

export interface IGraphQLApplication {
    query<T>(query: string, variables?: Record<string, any>): Promise<ApiGraphQLResult<T>>;
    mutation<T>(query: string, variables: Record<string, any>): Promise<ApiGraphQLResult<T>>;
    mutations<T>(query: string, variables: Record<string, any>[]): Promise<ApiGraphQLResult<T>[]>;
}

/**
 * Group
 */
export interface IGroupApplication extends IApplication {
    getGroups: () => ApiCmsGroup[];
}

/**
 * Model
 */
export interface IModelApplication extends IApplication {
    getModels: () => ApiCmsModel[];
    getModel: (id: string) => ApiCmsModel;
}

/**
 * Entry
 */
export interface IEntryApplicationCreateViaGraphQLResponse<T> {
    entries: T[];
    errors: ApiCmsError[];
}
export interface IEntryApplication extends IApplication {
    getEntries: (name: string) => CmsEntry[];
    createViaGraphQL<T>(
        model: ApiCmsModel,
        variableList: Record<string, any>[]
    ): Promise<IEntryApplicationCreateViaGraphQLResponse<T>>;
}

/**
 * Base
 */
export interface IBaseApplication {
    run(): Promise<void>;
    getNumberArg: (name: string, def: number) => number;
    getStringArg: (name: string, def: string) => string;
    getApp: <T>(name: string) => T;
    graphql: IGraphQLApplication;
}

export type ApiCmsGroup = Pick<BaseGroup, "id" | "name" | "slug">;

export interface ApiCmsModel
    extends Pick<BaseModel, "name" | "modelId" | "singularApiName" | "pluralApiName"> {
    fields: Pick<BaseCmsModelField, "id" | "fieldId" | "type">[];
}

export interface ApiCmsError {
    message: string;
    code: string;
    data?: Record<string, any> | null;
}

/**
 * CMS entries
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
    body: Record<string, any>;
    author: ApiCmsRef;
    categories: ApiCmsRef[];
}
