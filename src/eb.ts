/// All credit for this code goes to @tiller.s on discord
/// Their code was the basis for this

import {GameSave} from "./GameSave";

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
// @ts-expect-error: namespace doesn't matter
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
// @ts-expect-error: namespace doesn't matter
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
// @ts-expect-error: namespace doesn't matter
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
// @ts-expect-error: namespace doesn't matter
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
// @ts-expect-error: namespace doesn't matter
function calculate_sepe_target_MER(target_mer : number, current_pe : number, current_se : number) {
    const combos : {pe : number, se :number}[] = [];
    
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
// @ts-expect-error: namespace doesn't matter
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

// Anything after this is for solving JER
// It's more complicated
// @ts-expect-error: namespace doesn't matter
function calc_JER(pe : number, se : number) : number {
    const logSE = Math.log10(se);
    return (((0.1519 * Math.pow(logSE, 3) - 4.8517 * Math.pow(logSE, 2) + 48.248 * logSE - 143.46) / pe)*100*pe+100*49) / (pe + 100);
}

/**
 * JER's formula can be rearranged as a cubic equation in log(SE),
 * so we can use the cubic formula to solve it.
 * 
 * We need to take care to analyse the roots, since for cubic equations
 * there can be more than one, and we need to pick the one that makes sense. (i.e., positive)
 * The solver function only returns real roots, so no need to check for complex ones.
 * 
 * @param jer the targetted jer
 * @param pe the number of pe
 */
function calculate_se_for_target_jER(jer : number, pe : number) {
    const roots = solve_cubic_equation(
        0.1519,
        -4.8517,
        48.248,
        -((jer * (pe + 100)) / 100 + 94.46)
    );

    if (!roots.length) 
        // shouldn't happen, but we'll throw a fit just in case
        throw new Error('a cubic equation should have at least one real root ' + jer + ' ' + pe);

    // pick the biggest positive root
    // @ts-expect-error
    const logSE = roots.sort().findLast(r => r > 0);
    if (logSE == undefined)
        // only negative roots, which means there's no viable SE for that target JER / PE.
        return null;

    // the SE value needed would exceed viable SE counts
    if (logSE >= ALL_ROLES.length)
        return null;

    const se = Math.pow(10, logSE);
    return se;
}

/**
 * finds all possible ways to get that jer
 * @param target_jer the target jer
 * @param current_pe current pe of player
 * @param current_se current se of player 
 * @returns list of comboes
 */
// @ts-expect-error: namespace doesn't matter
function calculate_combos_for_target_jer(target_jer : number, current_pe : number, current_se : number) {
    const combos : {pe : number, se : number}[] = [];
    
    for (let new_pe = 0; new_pe <= 5; new_pe += 1) {
        const se_needed = calculate_se_for_target_jER(target_jer, current_pe + new_pe);
        if (se_needed == null)
            break;
        
        combos.push({
            pe: new_pe,
            se: Math.max(se_needed - current_se, 0)
        });
    }

    return combos;
}


/**
 * Returns the real roots of a cubic equation of the form:
 * a*x^3 + b*x^2 + c*x + d = 0
 * 
 * using the Cardano method which is an analytical solution.
 * adapted from https://gist.github.com/weepy/6009631
 * @param a the a in the cubic equation
 * @param b the b in the cubic equation
 * @param c the c in the cubic equation
 * @param d the d in the cubic equation
 */
function solve_cubic_equation(a : number, b : number, c : number, d : number) : number[] {
    if (a == 0)
        throw new Error('not a cubic equation');

    b /= a;
    c /= a;
    d /= a;
  
    let q : number, r, dum1, s, t, term1, r13;
  
    q = (3.0*c - (b*b))/9.0;
    r = -(27.0*d) + b*(9.0*c - 2.0*(b*b));
    r /= 54.0;
  
    const discriminant = q*q*q + r*r;
    
    const roots = [];
    
    term1 = (b/3.0);
  
    if (discriminant > 0) { // one root real, two are complex
        s = r + Math.sqrt(discriminant);
        s = ((s < 0) ? -Math.cbrt(-s) : Math.cbrt(s));
        t = r - Math.sqrt(discriminant);
        t = ((t < 0) ? -Math.cbrt(-t) : Math.cbrt(t));
        
        roots.push(-term1 + s + t);
    }

    // All roots real, at least two are equal.
    else if (discriminant == 0) {
        r13 = ((r < 0) ? -Math.cbrt(-r) : Math.cbrt(r));
        
        roots.push(-term1 + 2.0*r13);
        roots.push(-(r13 + term1));
    }
  
    // Only option left is that all roots are real and unequal (to get here, q < 0)
    else {
        q = -q;
        dum1 = q*q*q;
        dum1 = Math.acos(r/Math.sqrt(dum1));
        r13 = 2.0*Math.sqrt(q);
        
        roots.push(-term1 + r13*Math.cos(dum1/3.0));
        roots.push(-term1 + r13*Math.cos((dum1 + 2.0*Math.PI)/3.0))
        roots.push(-term1 + r13*Math.cos((dum1 + 4.0*Math.PI)/3.0))
    }
    
    return roots.sort();
}

////////////////////
// Clothed EB targetting below
////////////////////

/**
 * calculates the EB gained per se
 * @param pe the amount of pe
 * @param se_bonus the levels of se bonus researched
 * @param pe_bonus the amount of pe bonus researched
 * @param arti_effects the effects of artifacts and stones
 */
function calculate_Clothed_EB_per_SE(pe : number, se_bonus : number, pe_bonus : number, arti_effects: { prop_boost : number, soul_boost : number}) {
    return ((10 + se_bonus) * (1 + arti_effects["soul_boost"])) * ((1.05 + (0.01 * pe_bonus) + arti_effects["prop_boost"]) ** pe)
}

/**
 * finds the clothed eb
 * @param pe the amount of pe
 * @param pe_bonus the bonus pe research 
 * @param se the amount of se
 * @param se_bonus  the se epic research
 * @param arti_effects the artifact effects
 * @returns the clothed eb
 */
// @ts-expect-error: namespace doesn't matter
function calculate_clothed_eb(pe : number, pe_bonus : number, se : number, se_bonus : number, arti_effects : {prop_boost : number, soul_boost : number}) {
    return se * calculate_Clothed_EB_per_SE(pe, se_bonus, pe_bonus, arti_effects)
}

function calculate_clothed_SE_for_target(target_EB : number, pe : number, pe_bonus : number, se_bonus : number, arti_effects: { prop_boost : number, soul_boost : number}) {
    return target_EB / calculate_Clothed_EB_per_SE(pe, se_bonus, pe_bonus, arti_effects)
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
// @ts-expect-error: namespace doesn't matter
function calculate_clothed_SE_EB_target_combos(target_eb : number, current_se : number, current_pe : number, se_bonus : number, pe_bonus : number, arti_effects: { prop_boost : number, soul_boost : number}) {
    // Initial Comboes
    let combos = []
    let pe = 0
    while (true) {
        const se = calculate_clothed_SE_for_target(target_eb, pe, se_bonus, pe_bonus, arti_effects)
        combos.push({pe, se})
        if (se - current_se < 0) {
            break;
        }
        pe += 1
    }

    // Getting the actual player values
    return combos
        .map(({pe, se}) =>
            ({
                pe: pe - current_pe,
                se: Math.max(se - current_se, 0)
            })
        )
        .filter(({pe}) => pe >= 0);
}
