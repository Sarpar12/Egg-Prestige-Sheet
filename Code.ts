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
 *  - Duplicate Entires
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
    // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Data Fetching')
        .addItem("Refresh", "refresh_data")
        .addSeparator()
        // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Automatic Updates')
            .addItem('Enable Automatic Updates', 'create_auto_trigger')
            .addItem(`Disable Automatic Updates`, 'remove_trigger')
            .addItem("Automatic Update Info", 'automatic_trigger_info'))
        .addSeparator()
        // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Duplicate Entries')
            .addItem('Toggle Duplicate Entries', 'toggle_duplicates')
            .addItem(`Get Duplicate Status`, 'dupe_status'))
        .addSeparator()
        // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
        .addSubMenu(SpreadsheetApp.getUi().createMenu('EID stuff')
            .addItem('Set EID', 'setEID')
            .addItem('Show EID currently saved', 'showEID'))
        .addSeparator()
        // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Time Format')
            .addItem('MM-dd-yyyy HH:mm:ss', 'set_time_wrapper_2')
            .addItem('MM-dd-yyyy', 'set_time_wrapper_1')
            .addItem('dd-MM-yyyy HH:mm:ss', 'set_time_wrapper_4')
            .addItem('dd-MM-yyyy', 'set_time_wrapper_3')
            .addItem('Current Time Format', 'display_time_format'))
        .addSeparator()
        // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Calculations')
            .addItem("Calculate PE/SE for EB%", "calc_pese_eb")
            .addItem("Calculate PE/SE for MER", "calc_pese_mer")
            .addItem("Calculate PE/SE for JER", "calc_pese_jer"))
        .addSeparator()
        // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Extras')
            .addItem("Format Gains", "format_gains")
            .addItem("TESTING: calc_header", "set_calc_header"))
        .addToUi();
}

/**
 * Formats the gains found in the Calculations Sheet, 
 * currently formats SE gain, EB gain, EB and SE 
 * cells
 */
function format_gains() {
  var cell1: string[] = "true, 5, 7, Calculations".split(",")
  var cell2: string[] = "false, 5, 9, Calculations".split(",")
  var cell3: string[] = "false, 5, 6, Calculations".split(",")
  var cell4: string[] = "true, 5, 4, Calculations".split(",")
  for (var i = 0; i < cell1.length; i++) {
    cell1[i] = cell1[i].trim()
    cell2[i] = cell2[i].trim()
    cell3[i] = cell3[i].trim()
    cell4[i] = cell4[i].trim()
  }
  custom_number(cell1[0] === "true", parseInt(cell1[1]), parseInt(cell1[2]), cell1[3])
  custom_number(cell2[0] === "true", parseInt(cell2[1]), parseInt(cell2[2]), cell2[3])
  custom_number(cell3[0] === "true", parseInt(cell3[1]), parseInt(cell3[2]), cell3[3])
  custom_number(cell4[0] === "true", parseInt(cell4[1]), parseInt(cell4[2]), cell4[3])
}

/**
 * creates a trigger that automatically runs every ${user_input} hours, 
 * A succesful run will update the properties TRIGGER_SET and TRIGGER_TIME.
 * 
 * THERE CAN ONLY BE ONE TRIGGER 
 * 
 * If no number is detected or trigger already exists, a message will be shown 
 * and nothing will happen. 
 */
function create_auto_trigger() {
    // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
    let response = Math.round(parseFloat(SpreadsheetApp.getUi().prompt("Please enter the duration between each update(in hours): ").getResponseText()))
    if (!response || response == 0) {
        alert("Not a valid input!")
    }
    else {
        set_script_property("TRIGGER_TIME", `${response}`)
        if ((get_script_properties("TRIGGER_SET")) === "false" || !(get_script_properties("TRIGGER_SET"))) {
            // @ts-expect-error: ScriptApp only exists in Google App Scripts
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
 * If no trigger exists, a messsage will be shown and nothing else will happen
 */
function remove_trigger() {
    if ((get_script_properties("TRIGGER_SET") === "false") || !(get_script_properties("TRIGGER_SET"))) {
        alert("No Trigger has been set!")
    } else {
        // @ts-expect-error: ScriptApp only exists in Google App Scripts
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
    var regex = /^EI\d{16}$/; // Regular expression for the specified format
    // @ts-expect-error: SpreadsheetApp only exists in Google Sheets
    var EIDResponse = SpreadsheetApp.getUi().prompt('Please enter your EID:');
    var EID = EIDResponse.getResponseText(); // Extract the text entered by the user

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
 * returns the specified data in a list
 * 
 * @param save: an instance of the GameSave class
 * @return arr[]: [float, float, int, int, string, float, float]
 */
function get_data(save : GameSave) {
    // [Eb%, Soul Eggs, EOP, prestiges, time of backup]
    return [save.EB, save.SE, save.PE, save.prestiges, convert_time(save.time), save.MER, save.JER]
}

/**
 * converts an unix timestamp into a human-readable string
 * 
 * @param timestamp unix timestamp
 * @returns timestamp in the form of "MM-dd-yyyy HH:mm:ss"
 */
function convert_time(timestamp) {
    // @ts-expect-error: Utilities only exists in Google App Scripts
    return Utilities.formatDate(new Date(timestamp * 1000), get_tz(), get_time_format());
}

/**
 * gets the set timezone of the sheet
 * 
 * @returns the timezone of the Sheet as a string
 */
function get_tz(): string {
    // @ts-expect-error: SpreadsheetApp only exists on google sheets
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
    fill_cells(get_script_properties("DUPE_ENABLED") === "true", false)
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
 */
function fill_cells(dupe_enabled: boolean, automatic: boolean) {
    let save = new GameSave(get_script_properties('EID'))
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
 * @param data [eb, se, pe, prestiges, time, mer, jer]
 */
function sheet_fill(data: any[]) {
    var sheet = get_sheet("Prestige Data");
    if (sheet.getLastRow() === 0) {
        set_sheet_header()
    }
    data[0].push("")
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, data[0].length).setValues(data)
        .setHorizontalAlignment('left')
    set_color(sheet, sheet.getLastRow(), 1, data[0])
    custom_number(false, sheet.getLastRow(), 1, "Prestige Data")
    custom_number(true, sheet.getLastRow(), 2, "Prestige Data")
    link_latest()
}

/**
 * sets the background color for the specified cells
 * @param sheet the active sheet(ie: :"Prestige Data")
 * @param x the row of the cell
 * @param y the column of the cell
 * @param data the array from get_data()
 */
// @ts-expect-error: Sheet only exists in Google Sheets
function set_color(sheet: Sheet, row: number, col: number, data: any[]) {
    if (row % 2 == 0) {
        sheet.getRange(row, col, 1, data.length).setBackground('#696969')
            .setFontColor('white')
    } else {
        sheet.getRange(row, col, 1, data.length).setBackground('#DCDCDC')
            .setFontColor('black')
    }
}

/**
 * Sets the header(1st) row of the google sheets to the below 
 * 
 * | EB | SE | PE | Prestige Number | Date Pulled | MER | JER | Notes 
 * 
 * @precondition the first row of the sheet must be empty
 */
function set_sheet_header() {
    // @ts-expect-error: Sheet only exists within Google Sheets
    let sheet: Sheet = get_sheet("Prestige Data")
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
    // @ts-expect-error: Utilities only exists in Google App Scripts
    set_script_property("LAST_UPDATED", `${Utilities.formatDate(new Date(), get_tz(), get_time_format())}`)
    set_script_property("TIME_FORMAT", old_time)
}

/**
 * shhows the current status of DUPE_ENABLED
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
function check_dupe(save: GameSave) {
    //EID = PropertiesService.getScriptProperties().getProperty('EID')
    //var response = JSON.parse(UrlFetchApp.fetch(`https://eiapi-production.up.railway.app/callkev?EID=${EID}`).getContentText())
    var sheet = get_sheet("Prestige Data")
    var old_eb = sheet.getRange(sheet.getLastRow(), 1).getValue()
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

    // This section adds it to the sheet itself at an fixed postion
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
    let select_vars : [[string], [string], [string]] = [["Selected Role:"], ["Selected JER:"], ["Selected MER:"]]
    // (Starting row, starting column, row number, col number)
    // DO NOT USE: (1, 2), (2, 2), "(3, 2)
    sheet.getRange(1, 1, 3, 1).setValues(select_vars)
        .setBackground('#F1EE8E')
        .setFontColor('black')
        .setFontWeight('bold')

    // Setting up "header" rows, as in the rows about the actual header
    let header : [string, string, string] = ["EB%", "JER", "MER"]
    let rangeArray = []
    rangeArray.push(sheet.getRange("C1:D1").merge())
    rangeArray.push(sheet.getRange("E1:F1").merge())
    rangeArray.push(sheet.getRange("G1:H1").merge())
    for (let i = 0; i < rangeArray.length; i++) {
        rangeArray[i].setValue(header[i]).setHorizontalAlignment('center')
            .setBackground('#1565C0')
            .setFontWeight('bold')
            .setFontStyle('italic')
            .setFontColor('black')
    }

    // Setting up the actual headers
    // PE required | Se Required x3
    let headers = ["PE Required", "SE Required"]
    headers = Array(3).fill(headers).flat()
    sheet.getRange("C2:H2").setValues(headers)
        .setHorizontalAlignment('center')
        .setBackground('#E3F2FD')
        .setFontWeight('bold')
}