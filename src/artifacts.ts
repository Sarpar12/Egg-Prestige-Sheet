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
    return artifact_list.reduce<{
        [key: number]: { level: number, rarity: number, amount: number }
    }>((acc, artifact) => {
        const arti_spec = artifact.artifact.spec;
        // If the artifact name is not in the accumulator or if the current level is higher, update the accumulator
        if (!acc[arti_spec.name] || arti_spec.level > acc[arti_spec.name].level) {
            acc[arti_spec.name] = {level: arti_spec.level, rarity: arti_spec.rarity, amount: artifact.quantity};
        }
        return acc;
    }, {}); // Initial value of the accumulator is an empty object
}