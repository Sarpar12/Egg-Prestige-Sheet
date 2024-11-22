// credit to @toffepeer
/**
 * onOpen() is triggered whenever the sheet is opened.
 * Currently, it creates a menu shown below
 *
 * Data Fetching
 *  - Refresh
 *  - Automatic Updates
 *    - Enable Automatic Updates
 *    - Disable Automatic Updates
 *    - Automatic Update Information
 *  - Clothed EB
 *    - Toggle Clothed Override
 *    - Override Status
 *  - Duplicate Entries
 *    - Toggle Duplicate Entries
 *    - Get Duplicate Status
 *  - EID Stuff
 *    - Set EID
 *    - Show EID currently saved
 *  - Extras
 *    - Format Gains
 * For each item, unless it's a submenu name, it will call
 * the corresponding function in the 2nd parameter
 */
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Data Fetching')
        .addItem("Refresh", "refresh_data")
        .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Automatic Updates')
            .addItem('Enable Automatic Updates', 'create_auto_trigger')
            .addItem(`Disable Automatic Updates`, 'remove_trigger')
            .addItem("Automatic Update Info", 'automatic_trigger_info'))
        .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Duplicate Entries')
            .addItem('Toggle Duplicate Entries', 'toggle_duplicates')
            .addItem(`Get Duplicate Status`, 'dupe_status'))
        .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Clothed EB')
            .addItem('Keep Clothed Set(No Override)', 'toggle_clothed_override')
            .addItem('Display Override Status', 'display_override'))
        .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('EID stuff')
            .addItem('Set EID', 'setEID')
            .addItem('Show EID currently saved', 'showEID'))
        .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Time Format')
            .addItem('MM-dd-yyyy HH:mm:ss', 'set_time_wrapper_2')
            .addItem('MM-dd-yyyy', 'set_time_wrapper_1')
            .addItem('dd-MM-yyyy HH:mm:ss', 'set_time_wrapper_4')
            .addItem('dd-MM-yyyy', 'set_time_wrapper_3')
            .addItem('Current Time Format', 'display_time_format'))
        .addToUi();
}

/**
 * currently updates selected eb to match the selected role
 * @param e an event
 */
function onEdit(e : GoogleAppsScript.Events.SheetsOnEdit) {
    let range = e.range
    if (range.getSheet().getName() === "Calculations" && range.getA1Notation() === "B1") {
        let sheet = get_sheet("Calculations")
        let selectedRole = sheet.getRange("B1").getValue()
        sheet.getRange("B2").setValue(role_to_EB(selectedRole))
        custom_number(false, 2, 2, "Calculations")
    }
    if (range.getSheet().getName() === "Calculations" && range.getA1Notation() === "B4") {
        if (range.getValue() == "") {
            return
        }
        update_MER_wrapper()
    }
    if (range.getSheet().getName() === "Calculations" && range.getA1Notation() === "B1") {
        if (range.getValue() == "") {
            return
        }
        update_EB_wrapper()
    }
    if (range.getSheet().getName() === "Calculations" && range.getA1Notation() === "B3") {
        if (range.getValue() == "") {
            return
        }
        update_JER_wrapper()
    }
    const clothed_eb_array = ["D1", "D2", "D4", "E4", "F4", "D6", "E6", "F6"]
    if (range.getSheet().getName() === "Clothed EB" && clothed_eb_array.includes(range.getA1Notation())) {
        if (range.getValue() === "") {
            return
        }
        update_clothed_eb_limited()
    }
}

/**
 * creates a trigger that automatically runs every ${user_input} hours, 
 * A successful run will update the properties TRIGGER_SET and TRIGGER_TIME.
 * 
 * THERE CAN ONLY BE ONE TRIGGER 
 * 
 * If no number is detected or trigger already exists, a message will be shown 
 * and nothing will happen. 
 */
function create_auto_trigger() {
    let response = Math.round(parseFloat(SpreadsheetApp.getUi().prompt("Please enter the duration between each update(in hours): ").getResponseText()))
    if (!response || response == 0) {
        alert("Not a valid input!")
    }
    else {
        set_script_property("TRIGGER_TIME", `${response}`)
        if ((get_script_properties("TRIGGER_SET")) === "false" || !(get_script_properties("TRIGGER_SET"))) {
            ScriptApp.newTrigger('refresh_auto').timeBased().everyHours(response).create()
            set_script_property("TRIGGER_SET", "true")
            alert(`The sheet will update every ${get_script_properties("TRIGGER_TIME")} hours.`);
        } else {
            alert(`A trigger is set to run every ${get_script_properties("TRIGGER_TIME")} hours already exists! No trigger was added.`);
        }
    }
}

/**
 * removes a trigger if it already exists and updates properties TRIGGER_TIME and TRIGGER_SET. 
 * If no trigger exists, a message will be shown and nothing else will happen
 */
function remove_trigger() {
    if ((get_script_properties("TRIGGER_SET") === "false") || !(get_script_properties("TRIGGER_SET"))) {
        alert("No Trigger has been set!")
    } else {
        ScriptApp.deleteTrigger(ScriptApp.getProjectTriggers()[0])
        set_script_property("TRIGGER_SET", "false")
        alert(`The trigger that runs every ${get_script_properties("TRIGGER_TIME")} hours was removed.`);
        set_script_property("TRIGGER_TIME", "")
    }
}

/**
 * Displays how often a trigger is set to run and the last updated
 * time. If no trigger exists, it will display a different message
 */

function automatic_trigger_info() {
    if (!(get_script_properties("TRIGGER_TIME"))) {
        alert(`No Trigger has been set!\nLast Updated: ${get_script_properties("LAST_UPDATED")}`)
    } else {
        alert(`A trigger is set to run every ${get_script_properties("TRIGGER_TIME")} hours.\nLast Updated: ${get_script_properties("LAST_UPDATED")}`)
    }
}

/**
 * stores an EID inside a script property(and validates EID's)
 */
function setEID() {
    const regex = /^EI\d{16}$/; // Regular expression for the specified format
    const EIDResponse = SpreadsheetApp.getUi().prompt('Please enter your EID:');
    const EID = EIDResponse.getResponseText(); // Extract the text entered by the user

    // Check if the entered EID matches the required format
    if (regex.test(EID)) {
        set_script_property('EID', EID)
        alert(`Your EID ${EID} was stored successfully`);
    } else {
        alert('Invalid EID format. Please try again and enter EID in the format EI1234567890123456');
    }
}

/**
 * Shows the EID in the form of a UI popup
 */
function showEID() {
    alert(`The EID currently stored is: ${get_script_properties('EID')}`);
}

/**
 * converts a unix timestamp into a human-readable string
 * 
 * @param timestamp unix timestamp
 * @returns timestamp in the form of "MM-dd-yyyy HH:mm:ss"
 */
function convert_time(timestamp : number) {
    return Utilities.formatDate(new Date(timestamp * 1000), get_tz(), get_time_format());
}

/**
 * gets the set timezone of the sheet
 * 
 * @returns the timezone of the Sheet as a string
 */
function get_tz(): string {
    return SpreadsheetApp.getActive().getSpreadsheetTimeZone()
}

/**
 * Wrapper Function for fill_cells,
 * passes in the parameter
 */
function refresh_data() {
    if (!get_script_properties('EID')) {
        setEID()
    }
    let default_dupe = get_script_properties("DUPE_ENABLED")
    let dupe_bool = true
    if (default_dupe != "true" && default_dupe != null) {
        dupe_bool = false
    }
    fill_cells(dupe_bool, false)
}

/**
 * this function is called from the automatic trigger, 
 * assumes EID exists
 */
function refresh_auto() {
    fill_cells((get_script_properties("DUPE_ENABLED") === "true"), true)
}

/**
 * conditional logic to check if the sheet can be filled in
 * @param dupe_enabled if the property DUPE_ENABLED is "true"
 * @param automatic if the function wa run from an automatic call
 */
function fill_cells(dupe_enabled: boolean, automatic: boolean) : void {
    // @ts-ignore
    let save : myClasses.GameSave = new GameSave(get_script_properties('EID'))
    // Setting soul and prop bonus er's here 
    set_script_property('SE_ER', "" + save.soul_bonus)
    set_script_property('PE_ER', "" + save.prop_bonus)

    let data = save.sheetData
    if (dupe_enabled) {
        sheet_fill(data)
        set_update_time()
    } else {
        if (check_dupe(save)) {
            if (!automatic) {
                alert(`Duplicate EB found, sheet remains unchanged`);
            }
            return null
        } else {
            sheet_fill(data)
            set_update_time()
        }
    }
}

/**
 * Actually fills in the sheets
 *
 * @param data : [eb, se, pe, prestiges, time, mer, jer]
 */
function sheet_fill(data : myTypes.SheetDataArray) {
    // Setting Up Sheets
    const sheet = get_sheet("Prestige Data");
    const p_sheet = get_sheet('Calculations')
    const c_sheet = get_sheet('Clothed EB')
    if (sheet.getLastRow() === 0) { set_sheet_header(); }
    if (p_sheet.getLastRow() === 0) { set_calc_header(); }
    if (c_sheet.getLastRow() === 0) { set_clothed_header(); }
    // Actually using the data
    const dataList = convertSheetDataArray(data)
    dataList.push("")
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, dataList.length).setValues([dataList])
        .setHorizontalAlignment('left')
    set_color(sheet, sheet.getLastRow(), 1, dataList)
    custom_number(false, sheet.getLastRow(), 1, "Prestige Data")
    custom_number(true, sheet.getLastRow(), 2, "Prestige Data")
    link_latest()

    // Updating values
    update_EB_wrapper()
    update_JER_wrapper()
    update_MER_wrapper()
    set_prev_header_values(data)
    update_current_values(data)
    create_role_dropdown([EB_to_role(dataList[0] as number)])
    update_clothed_eb_wrapper()
}

/**
 * sets the background color for the specified cells
 * @param sheet the active sheet(ie: :"Prestige Data")
 * @param row the row of the cell
 * @param col the column of the cell
 * @param data the array from get_data()
 */
function set_color(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number, col: number, data: any[]) {
    if (row % 2 == 0) {
        sheet.getRange(row, col, 1, data.length).setBackground('#696969')
            .setFontColor('white')
    } else {
        sheet.getRange(row, col, 1, data.length).setBackground('#DCDCDC')
            .setFontColor('black')
    }
}

/**
 * Sets the header(1st) row of the Google sheets to the below
 * 
 * | EB | SE | PE | Prestige Number | Date Pulled | MER | JER | Notes 
 * 
 * @precondition the first row of the sheet must be empty
 */
function set_sheet_header() {
    let sheet: GoogleAppsScript.Spreadsheet.Sheet = get_sheet("Prestige Data")
    let str_arr: string[] = "EB, SE, PE, Prestige #, Date Pulled, MER, JER, Notes".split(", ")
    sheet.getRange(1, 1, 1, str_arr.length).setValues([str_arr])
        .setHorizontalAlignment("center")
        .setBackground('#3cdddc')
        .setFontWeight("bold")
        .setFontStyle("italic")

    // Sheet Manipulation
    sheet.setHiddenGridlines(true) // hides the gridlines
    sheet.setFrozenRows(1) // Freezes the first row(it's always displayed)
}

/**
 * writes the time of refresh_data()
 */
function set_update_time() {
    let old_time = get_time_format()
    if (old_time.slice(0, 3) === "dd") {
        set_time_wrapper_4()
    }
    set_script_property("LAST_UPDATED", `${Utilities.formatDate(new Date(), get_tz(), get_time_format())}`)
    set_script_property("TIME_FORMAT", old_time)
}

/**
 * shows the current status of DUPE_ENABLED
 */
function dupe_status() {
    if (!(get_script_properties("DUPE_ENABLED"))) {
        set_script_property("DUPE_ENABLED", "false")
    }
    if ((get_script_properties("DUPE_ENABLED")) === "true") {
        alert(`Duplicate Entries are enabled`);
    } else {
        alert(`Duplicate Entries are disabled`);
    }
}

/**
 * checks if two eb's are the same
 * @param save an instance of GameSave
 * @returns true if the new eb is the same as the old eb
 */
function check_dupe(save: myClasses.GameSave) {
    //EID = PropertiesService.getScriptProperties().getProperty('EID')
    //var response = JSON.parse(UrlFetchApp.fetch(`https://eiapi-production.up.railway.app/callkev?EID=${EID}`).getContentText())
    const sheet = get_sheet("Prestige Data")
    const old_eb = sheet.getRange(sheet.getLastRow(), 1).getValue()
    return save.EB == old_eb
}

/**
 * enables or disables duplicate entries
 */
function toggle_duplicates() {
    if ((get_script_properties("DUPE_ENABLED") === "true")) {
        set_script_property("DUPE_ENABLED", "false")
    } else {
        set_script_property("DUPE_ENABLED", "true")
    }
    dupe_status()
}

/**
 * enable or disable overriding clothed set
 */
function toggle_clothed_override() {
    if ((get_script_properties("OVERRIDE_ENABLED") === "true")) {
        set_script_property("OVERRIDE_ENABLED", "false")
    } else {
        set_script_property("OVERRIDE_ENABLED", "true")
    }
    display_override()
}

function display_override() {
    if (!(get_script_properties("OVERRIDE_ENABLED"))) {
        set_script_property("DUPE_ENABLED", "false")
    }
    if ((get_script_properties("OVERRIDE_ENABLED")) === "true") {
        alert(`Overriding set is enabled`);
    } else {
        alert(`Overriding set is disabled`);
    }
}

/**
 * sets the time to mm-dd-yyyy
 */
function set_time_wrapper_1() {
    set_time_format(false, true)
}

/**
 * sets the time to hh-mm-ss mm-dd-yyyy
 */
function set_time_wrapper_2() {
    set_time_format(true, true)
}

/**
 * sets the time to dd-mm-yyyy
 */
function set_time_wrapper_3() {
    set_time_format(false, false)
}

/**
 * sets the time to hh-mm-ss dd-mm-yyyy
 */
function set_time_wrapper_4() {
    set_time_format(true, false)
}

/**
 * sets the time format property of the sheets and 
 * alerts the user to the one that has just been set
 * 
 * @param hours_enabled if hours should be displayed
 * @param is_MM_dd where it should be mm-dd or dd-mm(smh europeans)
 */
function set_time_format(hours_enabled: boolean, is_MM_dd: boolean) {
    let hours = "HH:mm:ss"
    let time = "MM-dd-yyyy"
    if (!is_MM_dd) {
        time = "dd-MM-yyyy"
    }
    if (!hours_enabled) {
        hours = ""
    }
    set_script_property("TIME_FORMAT", `${time} ${hours}`)
    alert(`Time format has been set to ${get_script_properties("TIME_FORMAT")}`)
} 

/**
 * gets the time format, if empty
 * sets a default time format
 * 
 * @returns time format as a string
 */
function get_time_format() {
    if (!(get_script_properties("TIME_FORMAT"))) {
        set_script_property("TIME_FORMAT", "MM-dd-yyyy HH:mm:ss")
    }
    return get_script_properties("TIME_FORMAT")
}

/**
 * displays current time format to user
 */
function display_time_format() {
    alert(`Your currently selected format is ${get_time_format()}`)
}

/**
 * creates a link to the last update found in the sheet
 */
function link_latest() {
    // This section creates the formula that will do the jump
    let spreadsheet = get_sheet("Prestige Data")
    // last_row is a Number 
    let last_row = Math.round(spreadsheet.getLastRow())
    let jump_url = `=HYPERLINK("#gid=0range=A${last_row}", "Latest Update")`

    // This section adds it to the sheet itself at a fixed position
    // Values will most likely be fixed
    spreadsheet.getRange(2, 10, 1).setValue(jump_url).setBackground('#DCDCDC').setFontWeight('bold')
}

///////////////////////////
//////
////// Code After this Point is
////// for calculations only
//////
///////////////////////////

/**
 *  Sets the header row for 
 */
function set_calc_header() {
    let sheet = get_sheet("Calculations")
    // Create a 1x3 area(vertical)
    let select_vars : string[][] = [["Selected Role:"], ["Selected EB"], ["Selected JER:"], ["Selected MER:"]]
    // (Starting row, starting column, row number, col number)
    // DO NOT USE: (1, 2), (2, 2), "(3, 2)
    sheet.getRange(1, 1, 4, 1).setValues(select_vars)
        .setBackground('#F1EE8E')
        .setFontColor('black')
        .setFontWeight('bold')

    // Setting up "header" rows, as in the rows about the actual header
    let header : string[] = ["EB%", "JER", "MER"]
    let rangeArray = []
    rangeArray.push(sheet.getRange("C1:D1").merge())
    rangeArray.push(sheet.getRange("E1:F1").merge())
    rangeArray.push(sheet.getRange("G1:H1").merge())
    for (let i = 0; i < rangeArray.length; i++) {
        rangeArray[i].setValue(header[i]).setHorizontalAlignment('center')
            .setBackground('#1565C0')
            .setFontWeight('bold')
            .setFontStyle('italic')
            .setFontColor('white')
    }

    // Setting up the actual headers
    // PE required | Se Required x3
    let headers : string[] = ["PE Required", "SE Required"]
    headers = Array(3).fill(headers).flat()
    sheet.getRange("C2:H2").setValues([headers])
        .setHorizontalAlignment('center')
        .setBackground('#E3F2FD')
        .setFontWeight('bold')

    // Setting up the "current value" headers
    sheet.getRange("A5:B5").merge().setBackground('#000000') // separator
    let current_headers : string[] = ["Current Role", "Current EB", "Current JER", "Current MER"]
    let current_values : any[] = get_current_values()
    let combined_list = current_headers.map((item, index) => [item, current_values[index]])
    sheet.getRange("A6:B9").setValues(combined_list)
    custom_number(false, 7, 2, "Calculations") // Display EB with custom number

    // Setting Up previous value headers
    // Will be contained in its own two function
    // so it doesn't run when sheet is being initialized
    create_prev_header()

    // Setting up remaining things
    create_role_dropdown(current_values)
    create_dv_jer_mer()
}

/**
 * creates header for "previously updated values"
 */
function create_prev_header() {
    let sheet = get_sheet("Calculations")
    sheet.getRange("A10:B10").merge().setBackground('#000000')
    
    let string_arr = [["Previous Role:"], ["Previous EB"], ["Previous JER"], ["Previous MER"]]
    sheet.getRange("A11:A14").setValues(string_arr).setFontWeight('bold')

    sheet.getRange("A15:B15").merge().setBackground('#000000')
    let change_arr = [["Change in Role:"], ["Change in EB"], ["Change in JER"], ["Change in MER"], ["Prestige Amount"]]
    sheet.getRange("A16:A20").setValues(change_arr).setFontWeight('bold')
}

/**
 * Actually sets the values of the previous header
 * @param data the data param from sheet_fill - [eb, se, pe, prestiges, time, mer, jer]
 */
function set_prev_header_values(data : myTypes.SheetDataArray) {
    let trimmed_data = [EB_to_role(data.EB), data.EB, data.EB, data.MER, data.Prestiges]
    let sheet = get_sheet("Calculations")
    let p_sheet = get_sheet("Prestige Data")
    let prev_values : any[] = sheet.getRange("B6:B9").getValues()
    prev_values.push([p_sheet.getRange(p_sheet.getLastRow() - 1, 4, 1, 1).getValue()])
    let change_values : any[] = trimmed_data.map((value, index) => {
        if (index === 0 && typeof value === 'string' && value === prev_values[0][index]) {
            return [""];
        }
        if (index === 0 && typeof value === 'string' && value != prev_values[0][index]) {
            return [value];
        }
        return [value as number - prev_values[index]];
    });

    // Setting the actual values
    prev_values = prev_values.slice(0, -1)
    sheet.getRange("B11:B14").setValues(prev_values)
    custom_number(false, 12, 2, 'Calculations')
    sheet.getRange("B16:B20").setValues(change_values)
    custom_number(false, 17, 2, 'Calculations')
}

/**
 * updates the current values shown in the sheet
 */
function update_current_values(data :myTypes.SheetDataArray) {
    let sheet = get_sheet("Calculations")
    let range = sheet.getRange("B6:B9")
    let current_values = [[EB_to_role(data.EB)], [data.EB], [data.JER], [data.MER]]

    range.setValues(current_values)
    custom_number(false, 7, 2, "Calculations") // Display EB with custom number
}

/**
 * creates the role dropdown, if no data validation rule exists for that cell
 */
function create_role_dropdown(data : (string)[]) {
    let role_list : string[] = ALL_ROLES.slice(ALL_ROLES.indexOf(data[0]) + 1, -1) // Remove infinifarmer from the list
    let cell = get_sheet("Calculations").getRange("B1")
    create_data_validation_dropdown(cell, role_list)
}

/**
 * creates data validation rules for JER and MER input cells
 */
function create_dv_jer_mer() {
    let sheet = get_sheet("Calculations")
    let mer_cell = sheet.getRange("B3")
    let jer_cell = sheet.getRange("B4")
    create_data_validation_numerical(mer_cell, 1, 100)
    create_data_validation_numerical(jer_cell, 1, 200)
}

/**
 * gets the current values for Role, eb, JER, and MER
 * @returns [string, number, number, number], the current role, eb, jer, mer, values
 */
function get_current_values() : (string | number)[] {
    // @ts-ignore
    let save : myClasses.GameSave = new GameSave(get_script_properties("EID"))
    return [EB_to_role(save.EB), save.EB, save.JER, save.MER]
}

/**
 * updates the MER displayed in the sheet\
 * pulls information from Prestige Data sheet
 */
function update_MER_wrapper() {
    // Initial Getting
    let sheet = get_sheet('Calculations')
    if (sheet.getRange("B4").getValue() === "" || sheet.getRange("B4").getValue() > 100) {
        return;
    }
    let prestige_sheet = get_sheet("Prestige Data")
    let sepe = prestige_sheet.getRange(prestige_sheet.getLastRow(), 2, 1, 2).getValues()
    let target_mer = sheet.getRange("B4").getValue()
    let mer_combos = calculate_sepe_target_MER(target_mer, sepe[0][1], sepe[0][0])
    
    // Reset Previous Data
    reset_sheet_column(7, 2, 3, 999, "Calculations")

    // Parsing the response
    let data_length = mer_combos.length
    for (let i = 0; i < data_length; i++) {
        let values = [mer_combos[i].pe, mer_combos[i].se]
        sheet.getRange(`G${3+i}:H${3+i}`).setValues([values])
    }
    custom_number_wrapper(true, 3, 2+data_length, 8, 8, "Calculations")
}

/**
 * updates EB target information in the Google sheets
 */
function update_EB_wrapper() {
    // Initial Data Getting
    let sheet = get_sheet('Calculations')
    let prestige_sheet = get_sheet('Prestige Data')

    // Data Setup
    if (sheet.getRange("B1").getValue() === "") {
        return
    }
    let sepe = prestige_sheet.getRange(prestige_sheet.getLastRow(), 2, 1, 2).getValues()
    let sepe_bonus = [parseInt(get_script_properties('SE_ER')), parseInt(get_script_properties('PE_ER'))]
    let target_EB : number = role_to_EB(sheet.getRange("B1").getValue())
    let combos = calculate_SE_EB_target_combos(target_EB, sepe[0][0], sepe[0][1], sepe_bonus[0], sepe_bonus[1])

    // Clear previous data
    reset_sheet_column(3, 2, 3, 999, "Calculations")

    // Fill data into sheet
    let data_length = combos.length
    for (let i = 0; i < data_length; i++) {
        let values = [combos[i].pe, combos[i].se]
        sheet.getRange(`C${3+i}:D${3+i}`).setValues([values])
    }
    custom_number_wrapper(true, 3, 2+data_length, 4, 4, "Calculations")
}

/**
 * updates the MER displayed in the sheet\
 * pulls information from Prestige Data sheet
 */
function update_JER_wrapper() {
    // Initial Getting
    let sheet = get_sheet('Calculations')
    let prestige_sheet = get_sheet("Prestige Data")

    // setup
    if (sheet.getRange("B3").getValue() === "" || sheet.getRange("B1").getValue() > 200) {
        return;
    }
    let sepe = prestige_sheet.getRange(prestige_sheet.getLastRow(), 2, 1, 2).getValues()
    let target_mer = sheet.getRange("B3").getValue()
    let jer_combos = calculate_combos_for_target_jer(target_mer, sepe[0][1], sepe[0][0])
    
    // Reset Previous Data
    reset_sheet_column(5, 2, 3, 999, "Calculations")

    // Parsing the response
    let data_length = jer_combos.length
    for (let i = 0; i < data_length; i++) {
        let values = [jer_combos[i].pe, jer_combos[i].se]
        sheet.getRange(`E${3+i}:F${3+i}`).setValues([values])
    }
    custom_number_wrapper(true, 3, 2+data_length, 6, 6, "Calculations")
}

///////////// Code here is for clothed things
function create_clothed_role_dropdown(eb : number, cell : GoogleAppsScript.Spreadsheet.Range) {
    let role_list : string[] = ALL_ROLES.slice(ALL_ROLES.indexOf(EB_to_role(eb)) + 1, -1) // Remove infinifarmer from the list
    create_data_validation_dropdown(cell, role_list)
}

/**
 * sets the header values for clothed eb, sets up drop-downs and everything
 */
function set_clothed_header() {
    const sheet = get_sheet("Clothed EB")
    // EB% and Targeting Setup
    sheet.getRange("A1:B1").merge().setValue("Clothed EB%")
        .setBackground('#1565C0')
        .setHorizontalAlignment('center')
        .setFontWeight('bold')
        .setFontStyle('italic')
    sheet.getRange("A2:B2").setValues([["PE Required", "SE Required"]])
        .setHorizontalAlignment('center')
        .setBackground('#E3F2FD')
        .setFontWeight('bold')
    sheet.getRange("C1:C2").setValues([["Select Role"], ["Selected Bob"]])
        .setBackground('#F1EE8E')
        .setFontWeight('bold')
        .setFontColor('black')
    sheet.getRange("F1:G1").merge().setValue("Current Clothed EB")
        .setBackground('#1565C0')
        .setFontWeight('bold')
        .setFontStyle('italic')
        .setHorizontalAlignment('center')
    sheet.getRangeList(["C3", "C5"]).activate().setBackground('#F1EE8E').setFontWeight('bold')
    // Role dropdown unfortunately requires a game save, won't be in this function
    create_data_validation_dropdown(sheet.getRange("D2"), book_dropdown_information())

    // Stones Selection Setup:
    // Setting up menu
    const prop_stones : string[] = prop_stone_dropdown_information()
    const soul_stones : string[] = soul_stone_dropdown_information()
    sheet.getRange("C3:F3").setValues([["Selected Prop Stones", prop_stones[0], prop_stones[1], prop_stones[2]]])
    sheet.getRange("C5:F5").setValues([["Selected Soul Stones",soul_stones[0],soul_stones[1], soul_stones[0]]])
    const dropdown_ranges = sheet.getRangeList(['D4','E4', 'F4', 'D6', 'E6', 'F6']).activate()
    create_data_validation_dropdown_rangeList(dropdown_ranges, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
}

/**
 * determines which functions to call
 */
function update_clothed_eb_wrapper() {
    if (!(get_script_properties('OVERRIDE_ENABLED'))) {
        set_script_property('OVERRIDE_ENABLED', 'true')
    }
    if (get_script_properties(`OVERRIDE_ENABLED`) === "true") {
        update_clothed_eb_normal()
    } else {
        update_clothed_eb_limited()
    }
}

/**
 * update clothed eb - roles, targeting etc
 *
 * This function ignores previously set stones, resets it back to maxed clothed set
 */
function update_clothed_eb_normal() {
    // Setting up stuff
    // @ts-ignore
    const save = new GameSave(get_script_properties("EID")) as myClasses.GameSave
    const sheet  = get_sheet('Clothed EB')
    const best_eb_set = find_best_eb_set(save, save.get_arti_inv)
    const set_effect = determine_set_boost(best_eb_set)
    const clothed_eb = calculate_clothed_eb(save.PE, save.prop_bonus, save.SE, save.soul_bonus, set_effect)
    const stones = determine_stones_in_set(best_eb_set)

    // Actually filling the sheet data
    // Prefill clothed set values
    create_clothed_role_dropdown(clothed_eb, sheet.getRange("D1"));
    sheet.getRange("D2").setValue(convert_book_info_into_string(stones))
    const stone_list = convert_stone_data_into_list(stones)
    sheet.getRange("D4:F4").setValues([stone_list.prop_stones])
    sheet.getRange("D6:F6").setValues([stone_list.soul_stones])
    sheet.getRange("F2:G2").merge().setValue(clothed_eb)
    custom_number(false, 2, 6, "Clothed EB")

    update_clothed_EB(set_effect)
}

/**
 * this function doesn't ignore previously set stones and bob
 * will read in values from the sheet instead.
 */
function update_clothed_eb_limited() {
    const sheet  = get_sheet('Clothed EB')

    // Read in values from the sheet
    const bob_object = convert_string_into_book(sheet.getRange("D2").getValue());
    const prop_stones : number[] = [];
    const soul_stones: number[] = [];
    sheet.getRange("D4:F4").getValues()[0].forEach((value: number) => {
        prop_stones.push(value);
    })
    sheet.getRange("D6:F6").getValues()[0].forEach((value : number) => {
        soul_stones.push(value)
    })

    // Convert read in data into actual boost data
    const stones_object = convert_stone_list_into_data({ prop_stones: prop_stones, soul_stones: soul_stones })
    const final_set : myTypes.SheetBoostData = {
        book: bob_object,
        soul_stones : stones_object.soul_stones,
        prop_stones : stones_object.prop_stones
    }
    const boost_effect = determine_set_boost_extra(final_set)

    const data_sheet = get_sheet('Prestige Data')
    let sepe = data_sheet.getRange(data_sheet.getLastRow(), 2, 1, 2).getValues()[0].map((value) => {
        return parseFloat(value)
    })
    let sepe_bonus = [parseInt(get_script_properties('SE_ER')), parseInt(get_script_properties('PE_ER'))]
    let clothed_eb = calculate_clothed_eb(sepe[1], sepe_bonus[1], sepe[0], sepe_bonus[0], boost_effect)
    sheet.getRange("F2:G2").merge().setValue(clothed_eb)
    custom_number(false, 2, 6, "Clothed EB")

    update_clothed_EB(boost_effect)
}

function update_clothed_EB(boost_effect : myTypes.CumulBoost) {
    // Initial Data Getting
    let sheet = get_sheet('Clothed EB')
    let prestige_sheet = get_sheet('Prestige Data')

    // Data Setup
    if (sheet.getRange("D1").getValue() === "") {
        return
    }
    let sepe = prestige_sheet.getRange(prestige_sheet.getLastRow(), 2, 1, 2).getValues()
    let sepe_bonus = [parseInt(get_script_properties('SE_ER')), parseInt(get_script_properties('PE_ER'))]
    let target_EB : number = role_to_EB(sheet.getRange("D1").getValue())
    let combos = calculate_clothed_SE_EB_target_combos(target_EB, sepe[0][0], sepe[0][1], sepe_bonus[0], sepe_bonus[1], boost_effect)

    // Clear previous data
    reset_sheet_column(1, 2, 3, 999, "Clothed EB")

    // Fill data into sheet
    let data_length = combos.length
    for (let i = 0; i < data_length; i++) {
        let values = [combos[i].pe, combos[i].se]
        sheet.getRange(`A${3+i}:B${3+i}`).setValues([values])
    }
    custom_number_wrapper(true, 3, 2+data_length, 2, 2, "Clothed EB")
}