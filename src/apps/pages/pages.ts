import { IBaseApplication, IPageRunnerFactory, IPageRunnerResponse } from "~/types";

const executePageRunner = async (app: IBaseApplication): Promise<IPageRunnerResponse> => {
    const pageAmount = app.getNumberArg("page:amount", 10);

    for (let i = 0; i < pageAmount; i++) {
        /* empty */
    }

    return {
        total: 0,
        errors: [],
        pages: []
    };
};

export const pageRunnerFactory: IPageRunnerFactory = app => {
    return {
        id: "page",
        name: "Page",
        exec: () => {
            return executePageRunner(app);
        }
    };
};
