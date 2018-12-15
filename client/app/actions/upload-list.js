import { toast } from 'react-toastify';
import { createList } from './create-list';

let XLSX = require('xlsx');

/**
 * Actions for creating a list from an excel template
 */

/**
 * Read the saved excel file and create a columns object
 */
export function uploadList(url, listName, file) {
    let reader = new FileReader();
    reader.onload = function(e)
    {
        let data = e.target.result;
        let workbook = XLSX.read(data, {type : 'binary'});
        let rows = null;
        let columns = null;
        let options = ["Option1", "Option2", "Option3"];

        workbook.SheetNames.forEach( function(sheetName)
        {
            rows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);	
        })
        
        columns = rows.map((row, i) => {
            for (let j=0; j<options.length; j++) {
                if (row[options[j]] === undefined) {
                    row[options[j]] = "";
                }

                if (row[options[j]] === true) {
                    row[options[j]] = "TRUE";
                }

                if (row[options[j]] === false) {
                    row[options[j]] = "FALSE";
                }
            }

            return row;
        })

        createList(url, listName, columns);
    };

    reader.onerror = function(ex)
    {
        toast.error(ex, {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    };

    reader.readAsBinaryString(file);
}