/**
 * Gets the sheet by name if it exists, otherwise returns null
 * 
 * @param sheet_name the name of the sheet to get
 * @returns a Sheet object, see [this](https://developers.google.com/apps-script/reference/spreadsheet/sheet)
 */
// @ts-expect-error: Sheet only exists within google app scripts 
function get_sheet(sheet_name: string): Sheet {
    // @ts-expect-error: SpreadsheetApp only exists within google app scripts 
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
    // return SpreadsheetApp.getActiveSpreadSheet().getSheetByName(sheet_name)
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
        ['+36', 'U'], // Undeillion
    ]);
    let string_postfix: string = "";
    if (!is_se) { string_postfix = "%"}
    // @ts-expect-error: Sheet only exists within google app scripts 
    let sheet: Sheet = get_sheet(sheet_name)
    // toExponential() returns as string object
    let number: String = sheet.getRange(row, col).getValue().toExponential()
    let ending: String = number.slice(number.search(/[E]/i)+2, number.length)
    let div_ending = parseInt(ending.valueOf()) % 3
    if (abbreviations.has(`+${div_ending}`)) {
        var str_format = `[>=1E+${div_ending}]0.000${",".repeat(div_ending/3)}"${abbreviations.get(`+${div_ending}`)}${string_postfix}";`
        sheet.getRange(row, col).setNumberFormat(str_format)
    } else {
        sheet.getRange(row, col).setNumberFormat("0")
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
function get_script_properties(key): string {
    // @ts-expect-error: PropertiesService only exists in Google App Scripts
    return PropertiesService.getScriptProperties().getProperty(key)
}
    
/**
 * 
 * @param key the name of the property
 * @param value the new value of the property
 * @returns the [Properties](https://developers.google.com/apps-script/reference/properties/properties#setProperty(String,String)) that was just modified
 */
// @ts-expect-error: Properties only exists within google app scripts
function set_script_property(key, value): Properties {
    // @ts-expect-error: PropertiesService only exists in Google App Scripts
    return PropertiesService.getScriptProperties().setProperty(key, value)
}