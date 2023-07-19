import { CmsGroup as BaseGroup, CmsModel as BaseModel } from "@webiny/api-headless-cms/types";

export interface IApplication {
    run(): Promise<void>;
}

export interface ApiCmsMeta {
    totalCount: number;
    hasMoreItems: boolean;
    cursor: string | null;
}

export interface ApiGraphQLSuccessResult<T> {
    data: T;
    meta?: ApiCmsMeta | null;
    error?: never;
}

export interface ApiGraphQLErrorResult {
    data?: never | null;
    error: ApiCmsError;
}

export type ApiGraphQLResult<T> = ApiGraphQLSuccessResult<T> | ApiGraphQLErrorResult;

export interface IGraphQLApplication {
    query<T>(query: string, variables?: Record<string, any>): Promise<ApiGraphQLResult<T>>;
    mutation<T>(query: string, variables: Record<string, any>): Promise<ApiGraphQLResult<T>>;
}

export interface IBaseApplication {
    run(): Promise<void>;
    getApp: <T>(name: string) => T;
    graphql: IGraphQLApplication;
}

export type ApiCmsGroup = Pick<BaseGroup, "id" | "name" | "slug">;
export type ApiCmsModel = Pick<BaseModel, "name" | "modelId">;

export interface ApiCmsError {
    message: string;
    code: string;
    data: Record<string, any>;
}

/**
 * CMS entries
 */
export interface CmsEntry {
    id: string;
    entryId: string;
    modelId: string;
}

export interface ApiCmsCategory extends CmsEntry {
    title: string;
}

export interface ApiCmsAuthor extends CmsEntry {
    name: string;
    dateOfBirth: string | Date;
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
