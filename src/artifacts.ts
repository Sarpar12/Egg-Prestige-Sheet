//////////////////////
//
// For artifact calculations only
//
//////////////////////
const BOOK = 10
const PROP = 39
const SOUL = 34

// See https://github.com/elgranjero/EggIncProtos/tree/main/docs#artifactspecname 
// for which ids correspond with what
const EB_ARTIFACT_IDS : {[key : number] : string} = {
    10 : "Book of Basan",
    34 : "Soul Stone",
    39 : "Prophecy Stone"
}

const BOOK_EFFECT : {[key : number] : {[key : number] : number}} = {
    0 : {0 : 0.0025},
    1 : {0 : 0.005},
    2 : {0 : 0.0075, 2 : 0.008},
    3 : {0 : 0.01, 2 : 0.011, 3 : 0.012}
} 

// No, stones don't have rarities, but it makes the code easier to read 

const PROP_EFFECT : {[key : number] : {[key : number] : number}} = {
    0 : {0 : 0.0005},
    1 : {0 : 0.001},
    2 : {0 : 0.0015}
}

const SOUL_EFFECT : {[key : number] : {[key :number] : number}} = {
    0 : {0 : 0.05},
    1 : {0 : 0.1},
    2 : {0 : 0.25},
}

/**
 * CONFIRMED WORKING - 11/18/24
 *
 * finds all artifacts and stones in the inventory that boost eb
 * 
 * @param inventory the inventory found in the save file
 * @returns a list of Inventory items that contain effects to boost eb
 */
// @ts-ignore: namespace doesn't matter in gas
function find_eb_arti_stones(inventory : saveTypes.InventoryItemsList[]) {
    return inventory.filter(item => Object.keys(EB_ARTIFACT_IDS).map(Number).includes(item.artifact.spec.name))
}

/**
 * CONFIRMED WORKING 11/18/24
 *
 * calculates the best version of each artifact/stone
 * @param artifact_list the list of artifacts(should be presorted from previous functions)
 * @returns an object with properties of each object's name, and it's the highest level found
 */
// @ts-ignore: namespace doesn't matter
function find_best_artifacts(artifact_list: saveTypes.InventoryItemsList[]): { [key: number]: { level: number, rarity: number, amount: number} } {
    return artifact_list.reduce<{ [key: number]: { level: number, rarity: number, amount : number } }>((acc, artifact) => {
        const arti_spec = artifact.artifact.spec;
        // If the artifact name is not in the accumulator or if the current level is higher, update the accumulator
        if (!acc[arti_spec.name] || arti_spec.level > acc[arti_spec.name].level) {
            acc[arti_spec.name] = { level: arti_spec.level, rarity: arti_spec.rarity, amount: artifact.quantity };
        }
        return acc;
    }, {}); // Initial value of the accumulator is an empty object
}

/**
 * calculates the actual se boosts
 * @param artifact_list the list of artifacts, should be the output from find_best_artifacts()
 * @returns a object containing soul and prop boosts values
 */
function calculate_arti_boosts(artifact_list : {[key : number] : {level : number, rarity : number}}) : { prop_boost : number, soul_boost : number} {
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

/**
 * finds a given artifact by its id number
 * @param artifact_inv the artifact inventory
 * @param id the id of the artifact to find
 * @returns saveTypes.InventoryItemList
 */
function find_artifact_by_id(artifact_inv : saveTypes.InventoryItemsList[], id : number) {
    return artifact_inv.find(artifact => id === artifact.itemId)
}

/**
 * determines if an artifact contains eb stones
 * @param arti the artifact
 */
function contains_eb_stones(arti : saveTypes.Artifact) {
    for (let i = 0; arti.stonesList.length; i++)  {
        let stone_name = arti.stonesList[i].name
        if (EB_ARTIFACT_IDS[stone_name]) {
            return true
        }
    }
    return false
}

/**
 * determines if an artifact affects eb
 * @param arti a Artifact item
 * @returns boolean true or false
 */
function is_eb_artifact(arti : saveTypes.Artifact) {
    return !!EB_ARTIFACT_IDS[arti.spec.name];
}

/**
 * finds all sets within the saved sets that contain artifacts 
 * @param set_list the list of saved artifact sets
 * @param inv the inventory
 * @returns a 2d array of artifacts
 */
function find_eb_sets(set_list : saveTypes.SavedArtifactSetsList[], inv : saveTypes.InventoryItemsList[]) {
    let eb_sets : saveTypes.Artifact[][] = []
    for (let i = 0; i < set_list.length; i++) {
        let arti_id_list = set_list[i].slotsList
        let is_eb_set = false
        let arti_list : saveTypes.Artifact[] = []
        for (let j = 0; j < arti_id_list.length; j++) {
            let arti = find_artifact_by_id(inv, arti_id_list[j].itemId).artifact
            arti_list.push(arti)
            if (is_eb_artifact(arti)) {
                is_eb_set = true
            } 
            else if (contains_eb_stones(arti)) {
                is_eb_set = true
            }
        }
        if (is_eb_set) {
            eb_sets.push(arti_list)
        }
    }
    return eb_sets
}