import {
    ApiCmsCarMake,
    ApiCmsCarModel,
    IBaseApplication,
    IEntryRunnerFactory,
    IEntryRunnerResponse
} from "~/types";

interface Result {
    makes: ApiCmsCarMake[];
    models: ApiCmsCarModel[];
}

const executeCarsRunner = async (app: IBaseApplication): Promise<IEntryRunnerResponse<Result>> => {
    return {
        makes: [],
        models: [],
        total: 0,
        errors: []
    };
};

export const carsRunnerFactory: IEntryRunnerFactory<Result> = app => {
    return {
        name: "Cars",
        exec: () => {
            return executeCarsRunner(app);
        }
    };
};
