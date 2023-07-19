import {
    ApiCmsArticle,
    ApiCmsAuthor,
    ApiCmsCategory,
    ApiCmsError,
    ApiGraphQLResult,
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

interface RefEntry {
    id: string;
    modelId: string;
    name: string;
}

const getRandomAuthor = (entries: RefEntry[]): RefEntry => {
    const authors = entries.filter(entry => entry.modelId === "author");
    if (authors.length === 0) {
        throw new Error(`There are no authors in the database.`);
    }
    return authors[Math.floor(Math.random() * authors.length)];
};

const getRandomCategories = (entries: RefEntry[]): RefEntry[] => {
    const take = Math.floor(Math.random() * categories.length);
    return entries
        .filter(entry => entry.modelId === "category")
        .sort(() => Math.random() - 0.5)
        .slice(0, take === 0 ? 1 : take);
};

const categories: CmsCategory[] = [
    {
        id: "category-1",
        title: "Food Production"
    },
    {
        id: "category-2",
        title: "Space Exploration"
    },
    {
        id: "category-3",
        title: "Health Management"
    }
];

const getCategories = (): CmsCategory[] => {
    return [...categories];
};

const authors: CmsAuthor[] = [
    {
        id: "author-1",
        name: "John Doe",
        dateOfBirth: "1990-01-01"
    },
    {
        id: "author-2",
        name: "Jane Doe",
        dateOfBirth: "1995-12-12"
    },
    {
        id: "author-3",
        name: "Janine Doe",
        dateOfBirth: "2000-01-17"
    },
    {
        id: "author-4",
        name: "Jasmine Doe",
        dateOfBirth: "2005-11-25"
    },
    {
        id: "author-5",
        name: "Jared Doe",
        dateOfBirth: "2010-06-07"
    }
];

const getAuthors = (): CmsAuthor[] => {
    return [...authors];
};

const getArticles = (entries: RefEntry[], amount = 10): CmsArticle[] => {
    const articles: CmsArticle[] = [];
    for (let i = 0; i < amount; i++) {
        const author = getRandomAuthor(entries);
        const categories = getRandomCategories(entries);
        const categoryTitles = categories.map(category => category.name);
        articles.push({
            id: `article-${i + 1}`,
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

    const entries = categories
        .map(c => {
            return {
                id: c.id,
                name: c.title,
                modelId: categoryModel.modelId
            };
        })
        .concat(
            authors.map(a => {
                return {
                    id: a.id,
                    name: a.name,
                    modelId: authorModel.modelId
                };
            })
        );

    const articlesVariables = getArticles(entries);

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
