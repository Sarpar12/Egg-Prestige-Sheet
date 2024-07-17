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

/**
 * calculates the EB gained per se
 * @param pe the amount of pe
 * @param se_bonus the levels of se bonus researched
 * @param pe_bonus the amount of pe bonus researched
 */
function calculate_EB_per_SE(pe : number, se_bonus : number, pe_bonus : number) {
    return (10 + se_bonus) * ((1.05 + (0.01 * pe_bonus)) ** pe)
}

/**
 * finds the amount of se for the target
 * @param target_eb target eb to be reached
 * @param pe the amount of pe
 * @param se_bonus the amouunt of se bonus researched 
 * @param pe_bonus the amount of pe bonus researched
 * @returns the ammount of se requried
 */
function calculate_SE_for_target(target_eb : number, pe :number, se_bonus : number, pe_bonus : number) {
    return target_eb / calculate_EB_per_SE(pe, se_bonus, pe_bonus)
}

/**
 * finds combinations of se and pe that would reach a specified combination
 * @param target_eb the eb to be reached
 * @param current_se the current amount of se 
 * @param current_pe the current amount of pe
 * @param se_bonus se bonus researched
 * @param pe_bonus pe bonus researched
 * @returns list of objects containing pe and se amounts
 */
function calculate_SE_EB_target_combos(target_eb : number, current_se : number, current_pe : number, se_bonus : number, pe_bonus : number) {
    // Initial Comboes
    let combos = []
    let pe = 0
    while (true) {
        const se = calculate_SE_for_target(target_eb, pe, se_bonus, pe_bonus)
        combos.push({pe, se})
        if (se - current_se < 0) {
            break;
        }
        pe += 1
    }

    // Getting the actual player values
    let player_combo = combos
        .map(({pe, se}) => 
            ({
                pe: pe - current_pe,
                se: Math.max(se - current_se, 0)
            })
        )
        .filter(({pe}) => pe >= 0);

    return player_combo
}