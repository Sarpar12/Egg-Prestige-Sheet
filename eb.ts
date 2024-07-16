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
function get_se_pe_bonus() : number[] {
    let gameSave : GameSave = new GameSave(get_script_properties('EID'))
    return [gameSave.soul_bonus, gameSave.prop_bonus]
}

/**
 * calculates MER for a given se and pe amount
 * @param pe the amount of pe 
 * @param se the amount of se 
 * @returns MER for the specified pe and se
 */
function calc_mer(pe : number, se : number) : number {
    if (se <= 0) {
        return 0
    }
    let seQ :number = se / 1e18;
    return (91 * Math.log10(seQ) + 200 - pe) / 10;
}

/**
 * finds the se need for a targeted mer
 * @param target_mer the MER to be achieved
 * @param pe the amount of pe to calcuate with
 * @returns the number of SE required
 */
function calculate_se_target_MER(target_mer : number, pe : number) : number {
    let exp : number = (10 * target_mer + pe - 200) / 91;
    return (10 ** exp) * 1e18;
}

/**
 * finds combinations of pe and se for the targeted MER
 * @param target_mer the MER to be achieved
 * @param current_pe the current pe amount
 * @param current_se the current se amount
 * @returns a list of combinations for the targetted mer
 */
function calculate_sepe_target_MER(target_mer : number, current_pe : number, current_se : number) {
    const combos = [];
    
    for (let new_pe = 0; new_pe <= 5; new_pe += 1) {
        const se_needed = calculate_se_target_MER(target_mer, current_pe + new_pe);
        combos.push({
            pe: new_pe,
            se: Math.max(se_needed - current_se, 0)
        });
    }

    return combos;
}
