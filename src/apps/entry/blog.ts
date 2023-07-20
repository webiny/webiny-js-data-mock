import {
    ApiCmsArticle,
    ApiCmsAuthor,
    ApiCmsCategory,
    IBaseApplication,
    IEntryApplication,
    IEntryRunnerFactory,
    IEntryRunnerResponse,
    IModelApplication
} from "~/types";
import { logger } from "~/logger";

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
        id: "food-production-category",
        title: "Food Production"
    },
    {
        id: "space-exploration-category",
        title: "Space Exploration"
    },
    {
        id: "health-management-category",
        title: "Health Management"
    },
    {
        id: "energy-production-category",
        title: "Energy Production"
    },
    {
        id: "transportation-category",
        title: "Transportation"
    },
    {
        id: "communication-category",
        title: "Communication"
    },
    {
        id: "entertainment-category",
        title: "Entertainment"
    }
];

const getCategories = (): CmsCategory[] => {
    return [...categories];
};

const authors: CmsAuthor[] = [
    {
        id: "john-doe-author",
        name: "John Doe",
        dateOfBirth: "1990-01-01"
    },
    {
        id: "jane-doe-author",
        name: "Jane Doe",
        dateOfBirth: "1995-12-12"
    },
    {
        id: "janie-doe-author",
        name: "Janine Doe",
        dateOfBirth: "2000-01-17"
    },
    {
        id: "jasmine-doe-author",
        name: "Jasmine Doe",
        dateOfBirth: "2005-11-25"
    },
    {
        id: "jared-doe-author",
        name: "Jared Doe",
        dateOfBirth: "2010-06-07"
    },
    {
        id: "jason-doe-author",
        name: "Jason Doe",
        dateOfBirth: "2015-03-15"
    },
    {
        id: "jacob-doe-author",
        name: "Jacob Doe",
        dateOfBirth: "2020-02-29"
    }
];

const getAuthors = (): CmsAuthor[] => {
    return [...authors];
};

const getArticles = (entries: RefEntry[], amount: number): CmsArticle[] => {
    const articles: CmsArticle[] = [];
    const authorsArticle: Record<string, number> = {};
    for (let i = 0; i < amount; i++) {
        const author = getRandomAuthor(entries);
        const categories = getRandomCategories(entries);
        const categoryTitles = categories.map(category => category.name);
        authorsArticle[author.name] = (authorsArticle[author.name] || 0) + 1;
        articles.push({
            id: `article-${i + 1}`,
            title: `Article ${authorsArticle[author.name]} written by ${author.name}`,
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

interface Result {
    categories: ApiCmsCategory[];
    authors: ApiCmsAuthor[];
    articles: ApiCmsArticle[];
}

const executeBlogRunner = async (app: IBaseApplication): Promise<IEntryRunnerResponse<Result>> => {
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

    logger.debug(`Creating ${categoriesVariables.length} categories...`);
    const { entries: categories, errors: categoryErrors } =
        await entryApp.createViaGraphQL<ApiCmsCategory>(categoryModel, categoriesVariables);
    logger.debug(`...created.`);

    logger.debug(`Creating ${authorsVariables.length} authors...`);
    const { entries: authors, errors: authorErrors } =
        await entryApp.createViaGraphQL<ApiCmsAuthor>(authorModel, authorsVariables);
    logger.debug(`...created.`);

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

    const articleAmount = app.getNumberArg("articles", 10);
    const articlesVariables = getArticles(entries, articleAmount);

    logger.debug(`Creating ${articleAmount} articles...`);
    const { entries: articles, errors: articleErrors } =
        await entryApp.createViaGraphQL<ApiCmsArticle>(articleModel, articlesVariables);
    logger.debug(`...created.`);

    return {
        categories,
        authors,
        articles,
        errors: [...categoryErrors, ...authorErrors, ...articleErrors],
        total: categories.length + authors.length + articles.length
    };
};

export const blogRunnerFactory: IEntryRunnerFactory<Result> = app => {
    return {
        name: "Blog",
        exec: () => {
            return executeBlogRunner(app);
        }
    };
};
