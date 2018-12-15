import { toast } from 'react-toastify';

/**
 * Actions used when creating a new list from user defined columns
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
 * Create a new SharePoint list
 * @param {String} url 
 * @param {String} listName
 * @param {Array} columns 
 */
export function createList(url, listName, columns) {
    let destinationContext = new SP.ClientContext(url); 
    let listCreationInfo = new SP.ListCreationInformation();

    listCreationInfo.set_title(listName);
    listCreationInfo.set_templateType(SP.ListTemplateType.genericList);

    let oList = destinationContext.get_web().get_lists().add(listCreationInfo);
    destinationContext.load(oList);
    destinationContext.executeQueryAsync(onSuccess, onFail);

    function onSuccess()
    {
        toast.success(`List created.`, {
            position: toast.POSITION.BOTTOM_LEFT,
        });

        getLookups(url, listName, columns);
    }
}

/**
 * Get the details for any lookups defined in columns
 * @param {String} url 
 * @param {String} listName 
 * @param {Array} columns 
 */
function getLookups(url, listName, columns) {
    let destinationContext = new SP.ClientContext(url); 
    let hasLookups = false;
    let lists = {};

    for (let i = 0; i < columns.length; i++) {
        if (columns[i].Type == "Lookup" || columns[i].Type == "LookupMulti") {
            lists[columns[i].Option1] = destinationContext.get_web().get_lists().getByTitle(columns[i].Option1);    
            destinationContext.load(lists[columns[i].Option1]);
            hasLookups = true;
        }
    }

    if (hasLookups)
        destinationContext.executeQueryAsync(onSuccess, onFail);
    else
        appendColumns(url, listName, columns);

    function onSuccess() {
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].Type == "Lookup" || columns[i].Type == "LookupMulti") {
                columns[i].Option1 = lists[columns[i].Option1].get_id();
            }
        }

        appendColumns(url, listName, columns);
    }
}

/**
 * Add the columns to the list
 * @param {String} url 
 * @param {String} listName 
 * @param {Array} columns 
 */
function appendColumns(url, listName, columns) {
    let calculatedFields = {};
    let context = new SP.ClientContext(url);
    let oList = context.get_web().get_lists().getByTitle(listName);
    let fldCollection = oList.get_fields();
    let choices = [];

    for (let i=0; i<columns.length; i++) {
        let column = columns[i];
        let xml = "";
        let f1 = null;
        let required = column.Required === "Yes";

        switch(column.Type) {
            case("Text"):
                xml = `<Field Type='Text' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}'>${column.Option3 !== "" ? "<Default>" + column.Option3 + "</Default>" : ""}</Field>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldText);
                break;
            case("Note"):
                xml = `<Field Type='Note' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}' NumLines='${column.Option2}' RichText='${column.Option1}' Sortable='FALSE' />`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.defaultValue), SP.FieldMultiLineText);
                break;
            case("Choice"):
                xml = `<Field Type='Choice' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}'>${column.Option3 !== "" ? "<Default>" + column.Option3 + "</Default>" : ""}</Field>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldChoice);
                choices = column.Option2.split(";");
                f1.set_choices(choices);
                break;
            case("MultiChoice"):
                xml = `<Field Type='MultiChoice' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}'>${column.Option3 !== "" ? "<Default>" + column.Option3 + "</Default>" : ""}</Field>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldMultiChoice);
                choices = column.Option2.split(";");
                f1.set_choices(choices);
                break;
            case("Number"):
                xml = `<Field Type='Number' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}'>${column.Option3 !== "" ? "<Default>" + column.Option3 + "</Default>" : ""}</Field>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldNumber);
                break;
            case("Currency"):
                xml = `<Field Type='Currency' LCID='1033' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}'>${column.Option3 !== "" ? "<Default>" + column.Option3 + "</Default>" : ""}</Field>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldCurrency);
                break;
            case("DateTime"):
                xml = `<Field Type='DateTime' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}' Format='${column.Option2}' />`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldDateTime);
                break;
            case("Boolean"):
                xml = `<Field Type='Boolean' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}'>${column.Option3 !== "" ? "<Default>" + column.Option3 + "</Default>" : "<Default>0</Default>"}</Field>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldNumber);
                break;
            case("User"):
                xml = `<Field Type='User' Name='${column.InternalName}' StaticName='${column.InternalName}' UserSelectionMode='${column.Option2}' DisplayName='${column.InternalName}' Mult='${column.Option1}'/>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldUser);
                break;
            case("Lookup"):
                xml = `<Field Type='Lookup' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}' List='${column.Option1}' ShowField='${column.Option2}'/>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldLookup);
                break;
            case("LookupMulti"):
                xml = `<Field Type='LookupMulti' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}' List='${column.Option1}' ShowField='${column.Option2}' Mult='TRUE'/>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldLookup);
                break;
            case("URL"):
                xml = `<Field Type='URL' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}' Format='${column.Option1}'/>`;
                f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldUrl);
                break;
            case("Calculated"):
                calculatedFields[column.InternalName] = JSON.parse(JSON.stringify(column));
                break;
            default:
                break;
        }

        if (column.Type !== 'Calculated') {
            f1.set_title(column.DisplayName);
            f1.set_required(required);
            f1.update();
        }
    }

    while (Object.keys(calculatedFields).length > 0) {
        calculatedFields = addCalculatedFields(context, fldCollection, calculatedFields);
    }

    context.executeQueryAsync(onColumnsAdded, onFail);
    
    function onColumnsAdded()
    {
        toast.success(`Columns added.`, {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    }
}

/**
 * Format and add calculated fields
 * @param {Object} context 
 * @param {Object} calculatedFields 
 */
function addCalculatedFields(context, fldCollection, calculatedFields) {
    for (let key in calculatedFields) {
        let column = calculatedFields[key];
        let fieldRefs = column.Option3.split(';');
        let formula = `<Formula>=${column.Option2}</Formula>`;
        let fieldString = "<FieldRefs>";
        let contained = false;
        
        for (let i=0; i<fieldRefs.length; i++) {
            contained = calculatedFields.hasOwnProperty(fieldRefs[i].replace(/[\[\]]/g, '')) ? true : contained;
        }
        
        if (!contained) {
            for (let i=0; i<fieldRefs.length; i++) {
                fieldString += "<FieldRef Name='" + fieldRefs[i] + "'/>";
            }
            
            fieldString += "</FieldRefs>";

            let required = column.Required === "Yes";
            let xml = `<Field Type='Calculated' Name='${column.InternalName}' StaticName='${column.InternalName}' DisplayName='${column.InternalName}' ResultType='${column.Option1}'>${formula}${fieldString}</Field>`;
            let f1 = context.castTo(fldCollection.addFieldAsXml(xml, true, SP.AddFieldOptions.addToDefaultContentType), SP.FieldCalculated);
            f1.set_title(column.DisplayName);
            f1.set_required(required);
            f1.update();
            
            delete calculatedFields[key];
        } 
    }
    
    return calculatedFields;
}