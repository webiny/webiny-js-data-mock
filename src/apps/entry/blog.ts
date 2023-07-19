import { ApiCmsArticle, ApiCmsAuthor, ApiCmsCategory, CmsEntry } from "~/types";

export type CmsCategory = Pick<ApiCmsCategory, "title">;

export type CmsAuthor = Pick<ApiCmsAuthor, "name" | "dateOfBirth">;

export type CmsArticle = Pick<
    ApiCmsArticle,
    "title" | "description" | "categories" | "body" | "author"
>;

const getRandomAuthor = (entries: CmsEntry[]): ApiCmsAuthor => {
    const authors = entries.filter(
        entry => entry.modelId === "author"
    ) as unknown as ApiCmsAuthor[];
    if (authors.length === 0) {
        throw new Error(`There are no authors in the database.`);
    }
    return authors[Math.floor(Math.random() * authors.length)];
};

const getRandomCategories = (entries: CmsEntry[]): ApiCmsCategory[] => {
    const categories = entries.filter(
        entry => entry.modelId === "category"
    ) as unknown as ApiCmsCategory[];

    return categories
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * categories.length));
};

const categories: CmsCategory[] = [
    {
        title: "Food Production"
    },
    {
        title: "Space Exploration"
    },
    {
        title: "Health Management"
    }
];

export const createCategories = (): CmsCategory[] => {
    return [...categories];
};

const authors: CmsAuthor[] = [
    {
        name: "John Doe",
        dateOfBirth: new Date("1990-01-01")
    },
    {
        name: "Jane Doe",
        dateOfBirth: new Date("1995-12-12")
    },
    {
        name: "Janine Doe",
        dateOfBirth: new Date("2000-01-17")
    },
    {
        name: "Jasmine Doe",
        dateOfBirth: new Date("2005-11-25")
    },
    {
        name: "Jared Doe",
        dateOfBirth: new Date("2010-06-07")
    }
];

export const createAuthors = (): CmsAuthor[] => {
    return [...authors];
};

export const createArticles = (entries: CmsEntry[]): CmsArticle[] => {
    return Array(10).map(() => {
        const author = getRandomAuthor(entries);
        const categories = getRandomCategories(entries);
        return {
            title: `Article written by ${author.name}`,
            description: `Description of the article written by ${author.name}`,
            body: [
                {
                    tag: "h1",
                    content: `Article written by ${author.name}`
                }
            ],
            author: {
                id: author.id,
                modelId: "author"
            },
            categories: categories.map(c => {
                return {
                    id: c.id,
                    modelId: "category"
                };
            })
        };
    });
};
