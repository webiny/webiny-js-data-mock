const x = {
    modelId: "dateModel",
    name: "Date Model",
    group: "66f548f06fcf770002b38ae7",
    singularApiName: "DateModel",
    pluralApiName: "DatesModel",
    fields: [
        {
            multipleValues: false,
            listValidation: [],
            settings: {},
            renderer: { name: "text-input", settings: {} },
            helpText: null,
            predefinedValues: { enabled: false, values: [] },
            label: "Title",
            type: "text",
            tags: [],
            placeholderText: null,
            id: "5wtf4spa",
            validation: [
                { name: "required", message: "Value is required.", settings: {} },
                {
                    name: "minLength",
                    message: "Value is too short.",
                    settings: { value: "5" }
                },
                {
                    name: "maxLength",
                    message: "Value is too long.",
                    settings: { value: "50" }
                },
                {
                    name: "unique",
                    message: "Value must be unique.",
                    settings: {}
                },
                {
                    name: "pattern",
                    message: "Invalid value.",
                    settings: { flags: "ig", regex: "/^abc/", preset: "custom" }
                }
            ],
            storageId: "text@5wtf4spa",
            fieldId: "title"
        },
        {
            multipleValues: false,
            listValidation: [],
            settings: { type: "date" },
            renderer: { name: "date-time-input", settings: {} },
            helpText: null,
            predefinedValues: { enabled: false, values: [] },
            label: "Date Only",
            type: "datetime",
            tags: [],
            placeholderText: null,
            id: "4shz8254",
            validation: [
                {
                    name: "dateLte",
                    message: "Date/time is later than the provided one.",
                    settings: { type: "date", value: "2024-10-31" }
                },
                {
                    name: "dateGte",
                    message: "Date/time is earlier than the provided one.",
                    settings: { type: "date", value: "2024-10-01" }
                }
            ],
            storageId: "datetime@4shz8254",
            fieldId: "dateOnly"
        },
        {
            multipleValues: false,
            listValidation: [],
            settings: { type: "time" },
            renderer: { name: "date-time-input", settings: {} },
            helpText: null,
            predefinedValues: { enabled: false, values: [] },
            label: "Time Only",
            type: "datetime",
            tags: [],
            placeholderText: null,
            id: "yu1vr9gp",
            validation: [
                {
                    name: "dateGte",
                    message: "Date/time is earlier than the provided one.",
                    settings: { type: "time", value: "10:00" }
                },
                {
                    name: "dateLte",
                    message: "Date/time is later than the provided one.",
                    settings: { type: "time", value: "12:00" }
                }
            ],
            storageId: "datetime@yu1vr9gp",
            fieldId: "timeOnly"
        },
        {
            multipleValues: false,
            listValidation: [],
            settings: { type: "dateTimeWithTimezone" },
            renderer: { name: "date-time-input", settings: {} },
            helpText: null,
            predefinedValues: { enabled: false, values: [] },
            label: "Date Time With Timezone",
            type: "datetime",
            tags: [],
            placeholderText: null,
            id: "jmj15ptz",
            validation: [
                {
                    name: "dateLte",
                    message: "Date/time is later than the provided one.",
                    settings: {
                        type: "dateTimeWithTimezone",
                        value: "2024-10-31T10:00:00+02:00"
                    }
                },
                {
                    name: "dateGte",
                    message: "Date/time is earlier than the provided one.",
                    settings: {
                        type: "dateTimeWithTimezone",
                        value: "2024-10-01T10:00:00+02:00"
                    }
                }
            ],
            storageId: "datetime@jmj15ptz",
            fieldId: "dateTimeWithTimezone"
        },
        {
            multipleValues: false,
            listValidation: [],
            settings: { type: "dateTimeWithoutTimezone" },
            renderer: { name: "date-time-input", settings: {} },
            helpText: null,
            predefinedValues: { enabled: false, values: [] },
            label: "Date Time Without Timezone",
            type: "datetime",
            tags: [],
            placeholderText: null,
            id: "29fcgasx",
            validation: [
                {
                    name: "dateGte",
                    message: "Date/time is earlier than the provided one.",
                    settings: {
                        type: "dateTimeWithoutTimezone",
                        value: "2024-10-01 09:00:15"
                    }
                },
                {
                    name: "dateLte",
                    message: "Date/time is later than the provided one.",
                    settings: {
                        type: "dateTimeWithoutTimezone",
                        value: "2024-10-31 09:00:18"
                    }
                }
            ],
            storageId: "datetime@29fcgasx",
            fieldId: "dateTimeWithoutTimezone"
        },
        {
            multipleValues: true,
            listValidation: [
                {
                    name: "maxLength",
                    message: "Value is too long.",
                    settings: { value: "5" }
                },
                {
                    name: "minLength",
                    message: "Value is too short.",
                    settings: { value: "1" }
                }
            ],
            settings: { type: "date" },
            renderer: { name: "date-time-inputs" },
            helpText: null,
            predefinedValues: { enabled: false, values: [] },
            label: "Dates",
            type: "datetime",
            tags: [],
            placeholderText: null,
            id: "u4ce7pj7",
            validation: [
                {
                    name: "dateGte",
                    message: "Date/time is earlier than the provided one.",
                    settings: { type: "date", value: "2024-10-01" }
                },
                {
                    name: "dateLte",
                    message: "Date/time is later than the provided one.",
                    settings: { type: "date", value: "2024-10-31" }
                }
            ],
            storageId: "datetime@u4ce7pj7",
            fieldId: "dates"
        }
    ],
    layout: [["5wtf4spa"], ["4shz8254"], ["yu1vr9gp"], ["jmj15ptz"], ["29fcgasx"], ["u4ce7pj7"]],
    titleFieldId: "title",
    tags: ["type:model"]
};

console.log(x);
