import {
    ApiCmsCarMake,
    ApiCmsCarModel,
    IBaseApplication,
    IEntryApplication,
    IEntryRunnerFactory,
    IEntryRunnerResponse,
    IModelApplication
} from "~/types";
import { carsList } from "./carsList";
import baseSlugify from "slugify";
import { logger } from "~/logger";

const slugify = (value: string): string => {
    return baseSlugify(value, {
        replacement: "-",
        lower: true,
        trim: true
    });
};

type CmsCarMake = Pick<ApiCmsCarMake, "id" | "name">;
type CmsCarModel = Pick<ApiCmsCarModel, "id" | "name" | "make">;

const carMakes: CmsCarMake[] = [];
const carModels: CmsCarModel[] = [];
for (const item of carsList) {
    const { brand, models } = item;
    const carMakeId = `car-make-${slugify(brand)}`;
    carMakes.push({
        id: carMakeId,
        name: brand
    });
    for (const car of models) {
        carModels.push({
            id: `car-model-${slugify(brand)}-${slugify(car)}`,
            name: `${brand} ${car}`,
            make: {
                id: `${carMakeId}#0001`,
                modelId: "carMake"
            }
        });
    }
}

interface Result {
    makes: ApiCmsCarMake[];
    models: ApiCmsCarModel[];
}

const executeCarsRunner = async (app: IBaseApplication): Promise<IEntryRunnerResponse<Result>> => {
    const modelApp = app.getApp<IModelApplication>("model");
    const entryApp = app.getApp<IEntryApplication>("entry");
    /**
     * Models.
     */
    const carMakeModel = modelApp.getModel("carMake");
    const carModelModel = modelApp.getModel("carModel");
    /**
     * Car makes.
     */
    logger.debug(`Creating ${carMakes.length} car makes...`);
    const { entries: carMakesResults, errors: carMakesErrors } =
        await entryApp.createViaGraphQL<ApiCmsCarMake>(carMakeModel, carMakes);
    logger.debug(`...created.`);
    /**
     * Car Models.
     */
    const carModelsAtOnce = app.getNumberArg("carModels:atOnce", 10);
    logger.debug(`Creating ${carModels.length} car models...`);
    const { entries: carModelsResults, errors: carModelsErrors } =
        await entryApp.createViaGraphQL<ApiCmsCarModel>(carModelModel, carModels, carModelsAtOnce);
    logger.debug(`...created.`);

    return {
        makes: carMakesResults,
        models: carModelsResults,
        total: carMakesResults.length + carModelsResults.length,
        errors: [...carMakesErrors, ...carModelsErrors]
    };
};

export const carsRunnerFactory: IEntryRunnerFactory<Result> = app => {
    return {
        id: "cars",
        name: "Cars",
        exec: () => {
            return executeCarsRunner(app);
        }
    };
};
