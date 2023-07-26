import { GroupApplication } from "~/apps/GroupApplication";
import { CmsModel, CmsModelGroup } from "./types";

const createCarsMakeModel = (group: CmsModelGroup): CmsModel => {
    return {
        name: "Car Make",
        modelId: "carMake",
        singularApiName: "CarMake",
        pluralApiName: "CarMakes",
        description: "Car Make model.",
        group: {
            id: group.id,
            name: group.name
        },
        fields: [
            {
                id: "t9g4uh3gdfsn",
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
            }
        ],
        layout: [["t9g4uh3gdfsn"]]
    };
};

const createCarsModelModel = (group: CmsModelGroup): CmsModel => {
    return {
        name: "Car Model",
        modelId: "carModel",
        singularApiName: "CarModel",
        pluralApiName: "CarModels",
        description: "Car Model model.",
        group: {
            id: group.id,
            name: group.name
        },
        fields: [
            {
                id: "gojfbdangfsa",
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
                id: "vbfjhasfdbsjw3",
                fieldId: "make",
                label: "Make",
                type: "ref",
                settings: {
                    models: [
                        {
                            modelId: "carMake"
                        }
                    ]
                },
                renderer: {
                    name: "ref-advanced-single"
                }
            }
        ],
        layout: [["gojfbdangfsa"], ["vbfjhasfdbsjw3"]]
    };
};

export const createCarsModels = (app: GroupApplication): CmsModel[] => {
    const group = app.groups.find(g => g.slug === "cars");
    if (!group) {
        throw new Error(`Missing "cars" group.`);
    }
    return [createCarsMakeModel(group), createCarsModelModel(group)];
};
