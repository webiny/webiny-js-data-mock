import { CmsGroup as BaseGroup } from "@webiny/api-headless-cms/types/index.js";

export type CmsGroup = Pick<BaseGroup, "name" | "slug">;
