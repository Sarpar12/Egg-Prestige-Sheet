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

    let data = [get_data(save)]
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
function sheet_fill(data: any[]) {
    const sheet = get_sheet("Prestige Data");
    let p_sheet = get_sheet('Calculations')
    if (sheet.getLastRow() === 0) {
        set_sheet_header()
    }
    if (p_sheet.getLastRow() === 0) {
        set_calc_header()
    }
    data[0].push("")
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, data[0].length).setValues(data)
        .setHorizontalAlignment('left')
    set_color(sheet, sheet.getLastRow(), 1, data[0])
    custom_number(false, sheet.getLastRow(), 1, "Prestige Data")
    custom_number(true, sheet.getLastRow(), 2, "Prestige Data")
    link_latest()

    // Updating values
    update_EB_wrapper()
    update_JER_wrapper()
    update_MER_wrapper()
    set_prev_header_values(data[0])
    update_current_values(data[0])
    create_role_dropdown([EB_to_role(data[0][0])])
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
function set_prev_header_values(data : any[]) {
    let trimmed_data = [EB_to_role(data[0]), data[0], data[6], data[5], data[3]]
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
        return [value - prev_values[index]];
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
function update_current_values(data : any[]) {
    let sheet = get_sheet("Calculations")
    let range = sheet.getRange("B6:B9")
    let current_values = [[EB_to_role(data[0])], [data[0]], [data[6]], [data[5]]]

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


////////////////////////////
///////
////// Code here is used for testing
//////
////////////////////////////

function test_artifact_sets() {
    // @ts-ignore
    let save : myClasses.GameSave = new GameSave(get_script_properties("EID"))
    const eb_arti_stones = find_eb_arti_stones(save.get_arti_inv);
    const best_arti_sets = find_best_artifacts(eb_arti_stones);
    const arti_boost = calculate_arti_boosts(best_arti_sets)
    Logger.log(eb_arti_stones)
    Logger.log(best_arti_sets)
    Logger.log(arti_boost)
}