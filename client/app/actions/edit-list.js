import Api from '../lib/api';

/**
 * Actions used when editing an existing list
 */

/**
 * Get the field definitions and create an array of objects with the needed information to update the fields
 * @param {String} url 
 * @param {String} listName 
 */
export function getFields(url, listName) {
    return new Promise(resolve => {
        Api.get(
            `${url}/_api/web/lists/getbytitle('${listName}')/fields?$filter=CanBeDeleted eq true`
        ).then(resp => {
            let results = resp.d.results;
            let columns = [];

            for (let i=0; i<results.length; i++) {
                let column = {};
                    column.InternalName = results[i].InternalName;
                    column.Type = results[i].TypeAsString;
                    column.DisplayName = results[i].Title;
                    column.Required = results[i].Required ? "TRUE" : "FALSE";
                    column.Option1 = "";
                    column.Option2 = "";
                    column.Option3 = "";

                switch(column.Type) {
                    case("Currency"):
                    case("Number"):
                    case("Text"):
                    case("Boolean"):
                        column.Option3 = results[i].DefaultValue || "";
                        break;
                    case("Note"):
                        column.Option1 = results[i].RichText ? "TRUE" : "FALSE";
                        column.Option2 = results[i].NumberOfLines;
                        break;
                    case("Choice"):
                    case("MultiChoice"):
                        column.Option2 = results[i].Choices.results.join(';');
                        column.Option3 = results[i].DefaultValue || "";
                        break;
                    case("DateTime"):
                        column.Option2 = results[i].DisplayFormat === 0 ? "DateOnly" : "DateTime";
                        break;
                    case("User"):
                    case("UserMulti"):
                        column.Option1 = results[i].AllowMultipleValues ? "TRUE" : "FALSE";
                        column.Option2 = results[i].SelectionMode === 0 ? "PeopleOnly" : "PeopleAndGroups";
                        break;
                    case("Lookup"):
                    case("LookupMulti"):
                        column.Option1 = results[i].LookupList;
                        column.Option2 = results[i].LookupField;
                        break;
                    case("URL"):
                        column.Option2 = results[i].DisplayFormat === 0 ? "Hyperlink" : "Picture";
                        break;
                    case("Calculated"):
                        let formula = results[i].Formula;
                        let matches = results[i].SchemaXml.match(/FieldRef Name="([\w]+)"/g);
                        let fieldRefs = matches.map((field, i) => {
                            return field.match(/FieldRef Name="([\w]+)"/)[1]; 
                        })

                        column.Option1 = results[i].SchemaXml.match(/ResultType="([\w]+)"/)[1];
                        column.Option2 = formula.substring(1, formula.length);
                        column.Option3 = fieldRefs.join(';');
                        break;
                    default:
                        break;
                }

                columns.push(column);
            }

            resolve({status: "success", response: columns});
        }).catch(ex => {
            resolve({status: "error", error: ex});
        })
    })
}