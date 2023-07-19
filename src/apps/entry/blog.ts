import { nanoid } from "nanoid";
import {
    ApiCmsArticle,
    ApiCmsAuthor,
    ApiCmsCategory,
    ApiCmsError,
    ApiGraphQLResult,
    CmsEntry,
    IBaseApplication,
    IEntryApplication,
    IModelApplication
} from "~/types";

type CmsCategory = Pick<ApiCmsCategory, "id" | "title">;

type CmsAuthor = Pick<ApiCmsAuthor, "id" | "name" | "dateOfBirth">;

type CmsArticle = Pick<
    ApiCmsArticle,
    "id" | "title" | "description" | "categories" | "body" | "author"
>;

const getRandomAuthor = (entries: Pick<CmsEntry, "id" | "modelId">[]): ApiCmsAuthor => {
    const authors = entries.filter(
        entry => entry.modelId === "author"
    ) as unknown as ApiCmsAuthor[];
    if (authors.length === 0) {
        throw new Error(`There are no authors in the database.`);
    }
    return authors[Math.floor(Math.random() * authors.length)];
};

const getRandomCategories = (entries: Pick<CmsEntry, "id" | "modelId">[]): ApiCmsCategory[] => {
    const categories = entries.filter(
        entry => entry.modelId === "category"
    ) as unknown as ApiCmsCategory[];

    return categories
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * categories.length));
};

const categories: CmsCategory[] = [
    {
        id: nanoid(),
        title: "Food Production"
    },
    {
        id: nanoid(),
        title: "Space Exploration"
    },
    { id: nanoid(), title: "Health Management" }
];

const getCategories = (): CmsCategory[] => {
    return [...categories];
};

const authors: CmsAuthor[] = [
    {
        id: nanoid(),
        name: "John Doe",
        dateOfBirth: new Date("1990-01-01")
    },
    {
        id: nanoid(),
        name: "Jane Doe",
        dateOfBirth: new Date("1995-12-12")
    },
    {
        id: nanoid(),
        name: "Janine Doe",
        dateOfBirth: new Date("2000-01-17")
    },
    {
        id: nanoid(),
        name: "Jasmine Doe",
        dateOfBirth: new Date("2005-11-25")
    },
    {
        id: nanoid(),
        name: "Jared Doe",
        dateOfBirth: new Date("2010-06-07")
    }
];

const getAuthors = (): CmsAuthor[] => {
    return [...authors];
};

const getArticles = (
    entries: Pick<CmsEntry, "id" | "modelId">[],
    amount: number = 10
): CmsArticle[] => {
    const articles: CmsArticle[] = [];
    for (let i = 0; i < amount; i++) {
        const author = getRandomAuthor(entries);
        const categories = getRandomCategories(entries);
        const categoryTitles = categories.map(category => category.title);
        articles.push({
            id: nanoid(),
            title: `Article written by ${author.name}`,
            description: `Description of the article written by ${author.name}`,
            body: [
                {
                    tag: "h1",
                    content: `Article written by ${author.name} in ${categoryTitles.join(", ")}`
                }
            ],
            author: {
                id: author.id,
                modelId: author.modelId
            },
            categories: categories.map(category => {
                return {
                    id: category.id,
                    modelId: category.modelId
                };
            })
        });
    }
    return articles;
};

const mapEntries = <T>(errors: ApiCmsError[], results: ApiGraphQLResult<T>[]) => {
    const entries: T[] = [];
    for (const result of results) {
        if (result.error) {
            errors.push(result.error);
            continue;
        } else if (!result.data) {
            errors.push({
                message: `No data returned, but no error either.`,
                code: "MISSING_DATA"
            });
            continue;
        }
        entries.push(result.data);
    }
    return entries;
};

interface Result {
    categories: ApiCmsCategory[];
    authors: ApiCmsAuthor[];
    articles: ApiCmsArticle[];
    errors: ApiCmsError[];
}

export const executeBlog = async (app: IBaseApplication): Promise<Result> => {
    /**
     *
     */
    const modelApp = app.getApp<IModelApplication>("model");
    const entryApp = app.getApp<IEntryApplication>("entry");
    /**
     * Models we are going to use to build queries.
     */
    const categoryModel = modelApp.getModel("category");
    const authorModel = modelApp.getModel("author");
    const articleModel = modelApp.getModel("article");
    /**
     * Variables for the categories and authors to be inserted.
     */
    const categoriesVariables = getCategories();
    const authorsVariables = getAuthors();

    const errors: ApiCmsError[] = [];

    const categoriesResult = await entryApp.createViaGraphQL<ApiCmsCategory>(
        categoryModel,
        categoriesVariables
    );

    const categories = mapEntries<ApiCmsCategory>(errors, categoriesResult);

    const authorsResult = await entryApp.createViaGraphQL<ApiCmsAuthor>(
        authorModel,
        authorsVariables
    );
    const authors = mapEntries<ApiCmsAuthor>(errors, authorsResult);

    const articlesVariables = getArticles([...categories, ...authors]);

    const articlesResult = await entryApp.createViaGraphQL<ApiCmsArticle>(
        articleModel,
        articlesVariables
    );

    const articles = mapEntries<ApiCmsArticle>(errors, articlesResult);

    return {
        categories,
        authors,
        articles,
        errors
    };
};
