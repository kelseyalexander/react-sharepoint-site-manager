export const FieldSchema = {
    Note: {
        Option1: {type: "Choice", placeholder: "Rich Text?", options: ["TRUE", "FALSE"], required: true, default: "FALSE"},
        Option2: {type: "Number", required: true, default: 5}
    },
    Choice: {
        Option2: {type: "Text", placeholder: "Choices (';' delimited)", default: ""},
        Option3: {type: "Text", placeholder: "Default Value", default: ""}
    },
    MultiChoice: {
        Option2: {type: "Text", placeholder: "Choices (';' delimited)", default: ""},
        Option3: {type: "Text", placeholder: "Default Value", default: ""}
    },
    Lookup: {
        Option1: {type: "Text", placeholder: "Lookup List", required: true, default: ""},
        Option2: {type: "Text", placeholder: "Lookup Column", required: true, default: ""}
    },
    LookupMulti: {
        Option1: {type: "Text", placeholder: "Lookup List", required: true, default: ""},
        Option2: {type: "Text", placeholder: "Lookup Column", required: true, default: ""}
    },
    Calculated: {
        Option1: {type: "Text", placeholder: "Result Type", required: true, default: "Text"},
        Option2: {type: "Text", placeholder: "Formula", required: true, default: ""},
        Option3: {type: "Text", placeholder: "Field References (';' delimited)", required: true, default: ""}
    },
    User: {
        Option1: {type: "Choice", placeholder: "Allow Multiples?", options: ["TRUE", "FALSE"], required: true, default: "FALSE"},
        Option2: {type: "Choice", placeholder: "Select a User Selection Mode", options: ["PeopleAndGroups", "PeopleOnly"], required: true, default: "PeopleOnly"}
    },
    UserMulti: {
        Option1: {type: "Choice", placeholder: "Allow Multiples?", options: ["TRUE", "FALSE"], required: true, default: "FALSE"},
        Option2: {type: "Choice", placeholder: "Select a User Selection Mode", options: ["PeopleAndGroups", "PeopleOnly"], required: true, default: "PeopleOnly"}
    },
    DateTime: {
        Option2: {type: "Choice", placeholder: "Select a format", options: ["DateOnly", "DateTime"], required: true, default: "DateOnly"}
    },
    URL: {
        Option2: {type: "Choice", placeholder: "Select a format", options: ["Picture", "Hyperlink"], required: true, default: "Hyperlink"}
    },
    Text: {
        Option3: {type: "Text", placeholder: "Default Value", default: ""}
    },
    Number: {
        Option3: {type: "Text", placeholder: "Default Value", default: ""}
    },
    Currency: {
        Option3: {type: "Text", placeholder: "Default Value", default: ""}
    }
}