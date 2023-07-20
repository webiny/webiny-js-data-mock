import {
    ApiCmsCarMake,
    ApiCmsCarModel,
    IBaseApplication,
    IEntryRunnerFactory,
    IEntryRunnerResponse
} from "~/types";
import { carsList } from "./carsList";
import slugify from "slugify";

type CmsCarMake = Pick<ApiCmsCarMake, "id" | "name">;
type CmsCarModel = Pick<ApiCmsCarModel, "id" | "name" | "make">;

const carMakes: CmsCarMake[] = [];
const carModels: CmsCarModel[] = [];
for (const item of carsList) {
    const carMakeId = `car-make-${slugify(item.brand)}`;
    carMakes.push({
        id: carMakeId,
        name: item.brand
    });
    for (const car of item.models) {
        carModels.push({
            id: `car-model-${slugify(car)}`,
            name: car,
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
    return {
        makes: [],
        models: [],
        total: 0,
        errors: []
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
