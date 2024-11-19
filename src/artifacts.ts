//////////////////////
//
// For artifact calculations only
//
//////////////////////
// See https://github.com/elgranjero/EggIncProtos/tree/main/docs#artifactspecname
// for which ids correspond with what
import CumulBoost = myTypes.CumulBoost;

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

/**
 * helper function, maps an ID into an inventory item
 * @param itemId the item id to find
 * @param inventory the inventory of the player
 * @returns saveTypes.InventoryItemsList the object the was found
 */
function get_arti_from_id(itemId : number, inventory : saveTypes.InventoryItemsList[]) : saveTypes.InventoryItemsList {
    return inventory.find((artifact) => itemId === artifact.itemId)
}

/**
 * checks if a given set is an eb set using the following criteria
 *  - contains Book of Basan
 *  - contains Prop Stone(min x1)
 *  - contains Soul Stone(min x1)
 * @param arti_list the list of artifacts
 * @returns {boolean} if a given set is a eb set
 */
function is_eb_set(arti_list : saveTypes.InventoryItemsList[]) : boolean {
    if (!(arti_list)) {
        throw new Error('arti_list not found');
    }
    let valid_set = false
    arti_list.forEach((arti: saveTypes.InventoryItemsList) => {
        const name = arti.artifact.spec.name;
        const stones = arti.artifact.stonesList;

        if (EB_ARTIFACT_IDS[name]) {
            valid_set = true;
            return valid_set;
        }

        stones.forEach(stone => {
            if (EB_ARTIFACT_IDS[stone.name]) {
                valid_set = true;
                return valid_set;
            }
        })
    })
    return valid_set
}

/**
 * finds all the eb sets stored in the save and returns them
 *
 * **Note:** the type is converted from {@link saveTypes.SavedArtifactSetsList[]}
 * to {@link saveTypes.InventoryItemsList[][]}
 *
 * @param saved_sets the sets saved in the save file in
 * @param inventory the inventory of the playser
 * @returns eb set in InventoryItemsList[][] format
 */
function find_all_eb_sets(saved_sets : saveTypes.SavedArtifactSetsList[], inventory : saveTypes.InventoryItemsList[]) : saveTypes.InventoryItemsList[][]  {
    const eb_sets : saveTypes.InventoryItemsList[][] = [];
    saved_sets.forEach((saved_set) => {
        const saved_artifacts = saved_set.slotsList.map((slot) => get_arti_from_id(slot.itemId, inventory))
        eb_sets.push(saved_artifacts);
    })
    return eb_sets;
}

/**
 * Note: this is not the actual effect, just
 * an overall number that will be used
 *
 * determines the effectiveness of a set
 * @param arti_set the set to calculate with
 * @returns the decimal boost + 1
 */
function determine_set_boost(arti_set : saveTypes.InventoryItemsList[]) : myTypes.CumulBoost {
    const data_object : myTypes.CumulBoost = {
        soul_boost : 0,
        prop_boost : 0,
    }
    arti_set.forEach((arti) => {
        const name = arti.artifact.spec.name
        const rarity = arti.artifact.spec.rarity
        const stones = arti.artifact.stonesList
        if (EB_ARTIFACT_IDS[arti.artifact.spec.name] === "Book of Basan") {
            data_object.prop_boost += BOOK_EFFECT[name][rarity]
        }

        stones.forEach((stone) => {
            if (EB_ARTIFACT_IDS[stone.name] === "Soul Stone") {
                data_object.soul_boost += SOUL_EFFECT[name][rarity]
            }
            if (EB_ARTIFACT_IDS[stone.name] === "Prophecy Stone") {
                data_object.prop_boost += PROP_EFFECT[name][rarity]
            }
        })
    })
    return data_object;
}

/**
 * returns the set as a {@link saveTypes.InventoryItemsList[][]} format
 *
 * separate function will be used to extract the stones and book from it
 * @param gameSave the player save
 * @param inventory the inventory of the player
 */
function find_best_eb_set(gameSave : myClasses.GameSave, inventory : saveTypes.InventoryItemsList[]) : saveTypes.InventoryItemsList[] {
    const all_eb_sets = find_all_eb_sets(gameSave.arti_sets, inventory);
    let best_boost_index = -1
    for (let i = 0; i < all_eb_sets.length; i++) {
        const set_boost = determine_set_boost(all_eb_sets[i])
        let total_boost =
    }

    return best_eb_set
}