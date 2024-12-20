/**
 * Gets the sheet by name if it exists, otherwise returns null
 * 
 * @param sheet_name the name of the sheet to get
 * @returns a Sheet object, see [this](https://developers.google.com/apps-script/reference/spreadsheet/sheet)
 */
function get_sheet(sheet_name: string): GoogleAppsScript.Spreadsheet.Sheet {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
}


/**
 * Creates an alert, wrapper method for 
 * `SpreadsheetApp.getUi().alert()`
 */
function alert(input: string) {
    SpreadsheetApp.getUi().alert(input)
}

/**
 * Sets the custom number of a cell to format it to display
 * the correct letters
 * 
 * @param is_se if the number in the cell is SE or EB
 * @param row the row of the cell
 * @param col the column of the cell
 * @param sheet_name the name of the sheet
 */
function custom_number(is_se:boolean, row: number, col: number, sheet_name: string) {
    const abbreviations: Map<string, string> = new Map([
        ['+3', 'k'],  // thousand
        ['+6', 'm'],  // million
        ['+9', 'b'],  // billion
        ['+12', 't'], // trillion
        ['+15', 'q'], // quadrillion
        ['+18', 'Q'], // Quintillion
        ['+21', 's'], // Sextillion
        ['+24', 'S'], // Septillion
        ['+27', 'o'], // Octillion
        ['+30', 'N'], // Nonillion
        ['+33', 'd'], // decillion
        ['+36', 'U'], // Undecillion
    ]);
    let string_postfix: string = "";
    if (!is_se) { string_postfix = "%"}
    let sheet: GoogleAppsScript.Spreadsheet.Sheet = get_sheet(sheet_name)
    // toExponential() returns as string object
    let number: string = sheet.getRange(row, col).getValue().toExponential()
    let ending: string = number.slice(number.search(/E/i)+2, number.length)
    let div_ending = parseInt(ending.valueOf()) - parseInt(ending.valueOf()) % 3
    if (abbreviations.has(`+${div_ending}`)) {
        const str_format = `[>=1E+${div_ending}]0.000${",".repeat(div_ending/3)}"${abbreviations.get(`+${div_ending}`)}${string_postfix}";`
        sheet.getRange(row, col).setNumberFormat(str_format)
    } else {
        sheet.getRange(row, col).setNumberFormat("0")
    }
}

/**
 * wrapper function for custom number, simply runs a loop
 * @param is_se is the custom number for a se or eb
 * @param start_row the starting row
 * @param end_row the ending row
 * @param start_col the starting column
 * @param end_col the ending column
 * @param sheet_name the name of the set to set range for
 */
function custom_number_wrapper(is_se : boolean, start_row : number, end_row : number, start_col : number, end_col: number, sheet_name : string) {
    for (let i = start_row; i <= end_row; i++) {
        for (let j = start_col; j <= end_col; j++) {
            custom_number(is_se, i, j, sheet_name)
        }
    }
}

/**
 * returns the value of Property  with the specified name, if it exists. 
 * See [this](https://developers.google.com/apps-script/reference/properties/) 
 * for what Properties are
 * 
 * @param key the key of the property(name)
 * @returns the value of that specified property
 */
function get_script_properties(key : string): string {
    return PropertiesService.getScriptProperties().getProperty(key)
}
    
/**
 * 
 * @param key the name of the property
 * @param value the new value of the property
 * @returns the [Properties](https://developers.google.com/apps-script/reference/properties/properties#setProperty(String,String)) that was just modified
 */
function set_script_property(key : string, value : string): GoogleAppsScript.Properties.Properties {
    return PropertiesService.getScriptProperties().setProperty(key, value)
}

/**
 * creates a dropdown menu(basically a data validation)
 * for a specific cell
 * @param cell the cell to add the data validation too
 * @param values the list of values to add to the dropdown menu
 */
function create_data_validation_dropdown(cell : GoogleAppsScript.Spreadsheet.Range, values : any[])  {
    let data_validation_rule = SpreadsheetApp.newDataValidation().requireValueInList(values).build()
    cell.setDataValidation(data_validation_rule)
}

/**
 * the previous function, but sets the same values for a list of cells.
 * @param ranges the list of ranges to set the same dropdown for
 * @param values the values for which the dropdown occur
 */
function create_data_validation_dropdown_rangeList(ranges : GoogleAppsScript.Spreadsheet.RangeList, values : any[]) {
    const range_list = ranges.getRanges()
    range_list.forEach(range => {create_data_validation_dropdown(range, values)})
}

/**
 * creates a data validation to make sure the input is a number
 * @param cell the cell to create a data validation in
 * @param value1 the lower value
 * @param value2 the higher value(limit)
 */
function create_data_validation_numerical(cell : GoogleAppsScript.Spreadsheet.Range, value1 : number, value2: number) {
    let data_validation_rule = SpreadsheetApp.newDataValidation().requireNumberBetween(value1, value2).build()
    cell.setDataValidation(data_validation_rule)
}

/**
 * resets 2 columns, starting at a specified row
 * @param start_column start col
 * @param col_number number of columns
 * @param start_row the starting row
 * @param row_number number of rows
 * @param sheet_name the name of the sheet
 */
function reset_sheet_column(start_column : number, 
                            col_number : number, 
                            start_row : number, 
                            row_number : number,
                            sheet_name : string) {
    let sheet = get_sheet(sheet_name)
    sheet.getRange(start_row, start_column, row_number, col_number).clear()
}

/**
 * converts the array into an actual list, which Google sheets will then use
 * @param array the input SheetsDataArray object
 */
function convertSheetDataArray(array : myTypes.SheetDataArray) {
    return [array.EB, array.SE, array.PE, array.Prestiges, array.Time, array.MER, array.JER];
}