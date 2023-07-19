import { IApplication, IBaseApplication } from "~/types";
import { logger } from "~/logger";
import { createAuthors, createCategories } from "~/apps/entry/blog";

export class EntryApplication implements IApplication {
    private readonly app: IBaseApplication;
    public constructor(app: IBaseApplication) {
        this.app = app;
    }

    public async run(): Promise<void> {
        await this.runCreateBlog();
    }

    private async runCreateBlog() {
        const categories = createCategories();
        const authors = createAuthors();
    }
}
