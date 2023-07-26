import { CmsModel, CmsModelGroup } from "./types";
import { GroupApplication } from "~/apps/GroupApplication";

const createCategoryModel = (group: CmsModelGroup): CmsModel => {
    return {
        name: "Category",
        modelId: "category",
        singularApiName: "Category",
        pluralApiName: "Categories",
        description: "Category model.",
        group: {
            id: group.id,
            name: group.name
        },
        fields: [
            {
                id: "aBhLozTf",
                fieldId: "title",
                label: "Title",
                type: "text",
                validation: [
                    {
                        name: "required",
                        message: "Title is required."
                    }
                ],
                renderer: {
                    name: "text-input"
                }
            }
        ],
        layout: [["aBhLozTf"]]
    };
};

const createAuthorModel = (group: CmsModelGroup): CmsModel => {
    return {
        name: "Author",
        singularApiName: "Author",
        pluralApiName: "Authors",
        modelId: "author",
        description: "Author model.",
        group: {
            id: group.id,
            name: group.name
        },
        fields: [
            {
                id: "g36yFndu",
                fieldId: "name",
                label: "Name",
                type: "text",
                validation: [
                    {
                        name: "required",
                        message: "Name is required."
                    }
                ],
                renderer: {
                    name: "text-input"
                }
            },
            {
                id: "rLT9tSeG",
                fieldId: "dateOfBirth",
                label: "Date of Birth",
                type: "datetime",
                validation: [
                    {
                        name: "required",
                        message: "Age is required."
                    }
                ],
                settings: {
                    type: "date"
                },
                renderer: {
                    name: "date-time-input"
                }
            }
        ],
        layout: [["g36yFndu"], ["rLT9tSeG"]]
    };
};

const createArticleModel = (group: CmsModelGroup): CmsModel => {
    return {
        name: "Article",
        singularApiName: "Article",
        pluralApiName: "Articles",
        modelId: "article",
        description: "Article model.",
        group: {
            id: group.id,
            name: group.name
        },
        fields: [
            {
                id: "nXB3IMab",
                fieldId: "title",
                label: "Title",
                type: "text",
                validation: [
                    {
                        name: "required",
                        message: "Title is required."
                    }
                ],
                renderer: {
                    name: "text-input"
                }
            },
            {
                id: "bsWTA2Pj",
                fieldId: "description",
                label: "Description",
                type: "long-text",
                renderer: {
                    name: "long-text-text-area"
                }
            },
            {
                id: "HAUGedBn",
                fieldId: "body",
                label: "Body",
                type: "rich-text",
                renderer: {
                    name: "lexical-text-input"
                }
            },
            {
                id: "rK8YsHwQ",
                fieldId: "author",
                label: "Author",
                type: "ref",
                settings: {
                    models: [
                        {
                            modelId: "author"
                        }
                    ]
                },
                renderer: {
                    name: "ref-advanced-single"
                }
            },
            {
                id: "ckkDA58r",
                fieldId: "categories",
                label: "Categories",
                type: "ref",
                multipleValues: true,
                settings: {
                    models: [
                        {
                            modelId: "category"
                        }
                    ]
                },
                renderer: {
                    name: "ref-advanced-multiple"
                }
            }
        ],
        layout: [["nXB3IMab"], ["bsWTA2Pj"], ["HAUGedBn"], ["rK8YsHwQ", "ckkDA58r"]]
    };
};

export const createBlogModels = (app: GroupApplication): CmsModel[] => {
    const group = app.groups.find(g => g.slug === "blog");
    if (!group) {
        throw new Error(`Missing "blog" group.`);
    }
    return [createCategoryModel(group), createAuthorModel(group), createArticleModel(group)];
};
