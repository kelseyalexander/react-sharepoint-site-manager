import { toast } from 'react-toastify';
import { createList } from './create-list';
import Api from '../lib/api';
import * as Utils from '../lib/utils';

/**
 * Actions used when copying an existing SharePoint list to create a new list
 * Data from the source list can also be copied
 */

/**
 * Show an error mesage for any failed requests
 * @param {Object} sender 
 * @param {Object} args 
 */
function onFail(sender, args) {
    toast.error(args.get_message(), {
        position: toast.POSITION.BOTTOM_LEFT,
    });

    console.log(args.get_message());
}

/**
 * Read the fields from the the source list and create a new list with the same fields.
 * If copyData === Yes, data from the source list is also copied
 * @param {String} destination 
 * @param {String} listName 
 * @param {String} source 
 * @param {String} sourceListName 
 * @param {String} copyData 
 */
export function copyList(destination, listName, source, sourceListName, copyData) {
    Api.get(
        `${source}/_api/web/lists/getbytitle('${sourceListName}')/fields?$filter=CanBeDeleted eq true and TypeAsString ne 'Calculated'`
    ).then(resp => {
        let columns = resp.d.results;
        let context = new SP.ClientContext(destination); 
        let listCreationInfo = new SP.ListCreationInformation();
    
        listCreationInfo.set_title(listName);
        listCreationInfo.set_templateType(SP.ListTemplateType.genericList);
    
        let oList = context.get_web().get_lists().add(listCreationInfo);
        context.load(oList);
        context.executeQueryAsync(onSuccess, onFail);
    
        function onSuccess()
        {
            toast.success(`List created.`, {
                position: toast.POSITION.BOTTOM_LEFT,
            });

            let fldCollection = oList.get_fields();
            let f1 = null;

            for (let i = 0; i < columns.length; i++) {
                let regex = new RegExp(`DisplayName="${columns[i].Title}"`); // Display Name replaced with Internal Name to avoid special character replacements in the new list
                let xml = columns[i].SchemaXml.replace(regex, `DisplayName="${columns[i].InternalName}"`);

                if (columns[i].TypeAsString === "Choice" || columns[i].TypeAsString === "MultiChoice") {
                    f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldChoice);
                    f1.set_choices(columns[i].Choices.results);
                } 
                else if (columns[i].TypeAsString === "Note") {
                    f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.defaultValue), SP.FieldMultiLineText);
                } 
                else if (columns[i].TypeAsString === "URL") {
                    f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldUrl);
                } 
                else if (columns[i].TypeAsString === "LookupMulti") {
                    f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldLookup);
                } 
                else if (columns[i].TypeAsString === "UserMulti") {
                    f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldUser);
                } 
                else {
                    f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP[`Field${columns[i].TypeAsString}`]);
                }

                f1.set_title(columns[i].Title);
                f1.set_required(columns[i].Required);
                f1.update();
            }

            context.executeQueryAsync(onColumnsAdded, onFail);
            
            function onColumnsAdded()
            {
                toast.success(`Columns added.`, {
                    position: toast.POSITION.BOTTOM_LEFT,
                });

                if (copyData === "Yes") {
                    copyListData(destination, listName, source, sourceListName, columns);
                }
            }
        }
    }).catch(ex => {
        toast.error(JSON.stringify(ex), {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    })
}

/**
 * If the user selected copyData === Yes, build a query to get list items and request the top 5000
 * Some data transformations must be performed before inserting into the new list
 * @param {String} destination 
 * @param {String} listName 
 * @param {String} source 
 * @param {String} sourceListName 
 * @param {Array} columns 
 */
function copyListData(destination, listName, source, sourceListName, columns) {
    let query = "";
    let select = "";
	let expand = "";

	for (let i=0; i<columns.length; i++) {
        let key = columns[i].InternalName;
        
		if(columns[i].TypeAsString === "User" || columns[i].TypeAsString === "UserMulti") {
			select += `${select !== "" ? ', ' : ''}${key}/ID, ${key}/EMail, ${key}/Title`;
			expand += `${expand !== "" ? ', ' : ''}${key}`;
		}
		else if (columns[i].TypeAsString === "Lookup" || columns[i].TypeAsString === "LookupMulti") {
			select += `${select !== "" ? ', ' : ''}${key}/ID, ${key}/${columns[i].LookupField}`;
			expand += `${expand !== "" ? ', ' : ''}${key}`;
		} 
        else {
			select += `${select !== "" ? ', ' : ''}${key}`;
        } 
	}

	query = `
		${select !== "" ? ('$select=' + select) : ''}
		${select !== "" && expand !== "" ? ('&$expand=' + expand) : ''}
	`;

    Api.get(`
        ${source}/_api/web/lists/getbytitle('${sourceListName}')/items?${query}&$top=5000
    `).then(resp => {
        let results = resp.d.results;
        let itemType = Utils.getItemTypeForListName(listName);

        results.reduce((p, result) => {
            let item = {"__metadata": { "type": itemType }};

            for (let i=0; i<columns.length; i++) {
                let key = columns[i].InternalName;

                if(columns[i].TypeAsString === "User" || columns[i].TypeAsString === "Lookup") {
                    item[`${key}Id`] = result[key].ID;
                }
                else if(columns[i].TypeAsString === "UserMulti" || columns[i].TypeAsString === "LookupMulti") {
                    let userIds = [];

                    for (let j=0; j<result[key].results.length; j++) {
                        userIds.push(result[key].results[j].ID);
                    }

                    item[`${key}Id`] = {"__metadata": {"type": "Collection(Edm.Int32)"},"results": userIds};
                }
                else {
                    item[key] = result[key];
                } 
            }

            return p.then(chain => {
                Api.post(`
                    ${destination}/_api/web/lists/getbytitle('${listName}')/items
                `, item).then(result =>
                    [...chain, 'done']
                )
            })
        }, Promise.resolve([])).then(resp => {
            toast.success(`Data added.`, {
                position: toast.POSITION.BOTTOM_LEFT,
            });
        })
    }).catch(ex => {
        toast.error(JSON.stringify(ex), {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    })
}