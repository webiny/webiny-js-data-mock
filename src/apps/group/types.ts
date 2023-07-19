import { CmsGroup as BaseGroup } from "@webiny/api-headless-cms/types";

export type CmsGroup = Pick<BaseGroup, "name" | "slug">;
