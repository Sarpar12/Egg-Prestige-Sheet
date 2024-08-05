//////////////////////
//
// For artifact calculations only
//
//////////////////////

import * as saveTypes from "./saveTypes"

const BOOK = 10
const PROP = 39
const SOUL = 34

// See https://github.com/elgranjero/EggIncProtos/tree/main/docs#artifactspecname 
// for which id's correspond with what
export const EB_ARTFIACT_IDS : {[key : number] : string} = {
    10 : "Book of Basan",
    34 : "Soul Stone",
    39 : "Prophecy Stone"
}

export const BOOK_EFFECT : {[key : number] : {[key : number] : number}} = {
    0 : {0 : 0.0025},
    1 : {0 : 0.005},
    2 : {0 : 0.0075, 2 : 0.008},
    3 : {0 : 0.01, 2 : 0.011, 3 : 0.012}
} 

// No, stones don't have rarities, but it makes the code easier to read 

export const PROP_EFFECT : {[key : number] : {[key : number] : number}} = {
    0 : {0 : 0.0005},
    1 : {0 : 0.001},
    2 : {0 : 0.0015}
}

export const SOUL_EFFECT : {[key : number] : {[key :number] : number}} = {
    0 : {0 : 0.05},
    1 : {0 : 0.1},
    2 : {0 : 0.25},
}

/**
 * finds all artifacts and stones in the inventory that boost eb
 * 
 * NOTE: this only returns the Artifact Portion of the item, anything else is stricly
 *       unecessary
 * @param inventory the inventory found in the save file
 * @returns a list of Inventory items that contain effects to boost eb
 */
export function find_eb_arti_stones(inventory : saveTypes.InventoryItemsList[]) {
    let eb_arti : saveTypes.Artifact[] = []
    for (let i = 0; i < inventory.length; i++) {
        let item : saveTypes.InventoryItemsList = inventory[i]
        if (EB_ARTFIACT_IDS[item.artifact.spec.name]) {
            eb_arti.push(item.artifact)
        }
    }
    return eb_arti
}

/**
 * calculates the best version of each artifact/stone
 * @param artifact_list the list of artifacts(should be presorted from previous functions)
 * @returns an object with properties of each object's name and it's highest level found
 */
export function find_best_artifacts(artifact_list : saveTypes.Artifact[]) : {[key : number] : {level : number, rarity : number}} {
    let split_list : {[key : number] : {level : number, rarity : number}} = {}
    for (let i = 0; i < artifact_list.length; i++) {
        let arti_spec : saveTypes.Spec2 = artifact_list[i].spec
        if ((!(split_list[arti_spec.name])) || arti_spec.level > split_list[arti_spec.name]["level"]) {
            split_list[arti_spec.name] = {level : arti_spec.level, rarity : arti_spec.rarity}
        }
    }
    return split_list
}

/**
 * calculates the actual se boosts
 * @param artifact_list the list of artifacts, should be the output from find_best_artifacts()
 * @returns a object containing soul and prop boosts values
 */
export function calculate_arti_boosts(artifact_list : {[key : number] : {level : number, rarity : number}}) : { prop_boost : number, soul_boost : number} {
    let prop_boost = 0.0
    let soul_boost = 0.0

    Object.keys(artifact_list).forEach( key => {
        let int_key = parseInt(key)
        if (int_key === BOOK) {
            prop_boost += BOOK_EFFECT[artifact_list[int_key]["level"]][artifact_list[int_key]["rarity"]]
        }
        if (int_key === PROP) {
            prop_boost += PROP_EFFECT[artifact_list[int_key]["level"]][artifact_list[int_key]["rarity"]]
        }
        if (int_key === SOUL) {
            soul_boost += SOUL_EFFECT[artifact_list[int_key]["level"]][artifact_list[int_key]["rarity"]]
        }
    })

    return {prop_boost: prop_boost, soul_boost : soul_boost}
}