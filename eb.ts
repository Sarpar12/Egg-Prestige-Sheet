/// All credit for this code goes to @tiller.s on discord
/// Their code was the basis for this

const ALL_ROLES : string[] = [
    "Farmer I",
    "Farmer I",
    "Farmer I",
    "Farmer II",
    "Farmer III",
    "Kilofarmer I",
    "Kilofarmer II",
    "Kilofarmer III",
    "Megafarmer I",
    "Megafarmer II",
    "Megafarmer III",
    "Gigafarmer I",
    "Gigafarmer II",
    "Gigafarmer III",
    "Terafarmer I",
    "Terafarmer II",
    "Terafarmer III",
    "Petafarmer I",
    "Petafarmer II",
    "Petafarmer III",
    "Exafarmer I",
    "Exafarmer II",
    "Exafarmer III",
    "Zettafarmer I",
    "Zettafarmer II",
    "Zettafarmer III",
    "Yottafarmer I",
    "Yottafarmer II",
    "Yottafarmer III",
    "Xennafarmer I",
    "Xennafarmer II",
    "Xennafarmer III",
    "Weccafarmer I",
    "Weccafarmer II",
    "Weccafarmer III",
    "Vendafarmer I",
    "Vendafarmer II",
    "Vendafarmer III",
    "Uadafarmer I",
    "Uadafarmer II",
    "Uadafarmer III",

    "Infinifarmer" // always keep it as the last one
];

let gameSave : GameSave = new GameSave(get_script_properties("EID"))

/**
 * converts an earnings bonus into a farmer role
 * @param EB the earnings bonus, as an number
 * @returns string, the farmer role
 */
function EB_to_role(EB: number) : string {
    let power : number = -1
    while (EB >= 1) {
        EB /= 10;
        power++
    }
    const ind = Math.min(Math.max(power, 0), ALL_ROLES.length - 1)
    return ALL_ROLES[ind]
}

/**
 * converts a given role into a eb role
 * @param role the role selected
 */
function role_to_EB(role: string) : number{
    // In case a role isn't found
    let role_position : number = Math.max(ALL_ROLES.indexOf(role), 0)
    return (10**role_position)
}

/**
 * returns the se and pe bonus as an list
 * @param gameSave the save file of the user
 * @returns a number list of [soul bounus, prop bonus]
 */
function get_se_pe_bonus(gameSave) : number[] {
    return [gameSave.soul_bonus, gameSave.prop_bonus]
}
