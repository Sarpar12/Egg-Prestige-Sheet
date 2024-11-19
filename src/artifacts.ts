//////////////////////
//
// For artifact calculations only
//
//////////////////////
// See https://github.com/elgranjero/EggIncProtos/tree/main/docs#artifactspecname
// for which ids correspond with what
const EB_ARTIFACT_IDS : Record<number, string> = {
    10 : "Book of Basan",
    34 : "Soul Stone",
    39 : "Prophecy Stone"
}

const BOOK_EFFECT : Record<number, Record<number, number>> = {
    0 : {0 : 0.0025},
    1 : {0 : 0.005},
    2 : {0 : 0.0075, 2 : 0.008},
    3 : {0 : 0.01, 2 : 0.011, 3 : 0.012}
} 

// No, stones don't have rarities, but it makes the code easier to read 

const PROP_EFFECT : Record<number, Record<number, number>> = {
    0 : {0 : 0.0005},
    1 : {0 : 0.001},
    2 : {0 : 0.0015}
}

const SOUL_EFFECT : Record<number, Record<number, number>> = {
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
 * @returns {boolean} if a given set is an eb set
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
 * @param inventory the inventory of the player
 * @returns eb set in InventoryItemsList[][] format
 */
function find_all_eb_sets(saved_sets : saveTypes.SavedArtifactSetsList[], inventory : saveTypes.InventoryItemsList[]) : saveTypes.InventoryItemsList[][]  {
    const eb_sets : saveTypes.InventoryItemsList[][] = [];
    saved_sets.forEach((saved_set) => {
        const saved_artifacts = saved_set.slotsList.map((slot) => get_arti_from_id(slot.itemId, inventory))
        eb_sets.push(saved_artifacts);
    })
    return eb_sets.filter((set) => {
        // Check if all artifacts in the set are defined using nullish coalescing
        const allArtifactsDefined = set.every(artifact =>
            (artifact ?? null) !== null
        );

        // Only call is_eb_set if all artifacts are defined
        return allArtifactsDefined && is_eb_set(set);
    });
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
        const rarity = arti.artifact.spec.rarity
        const stones = arti.artifact.stonesList
        if (EB_ARTIFACT_IDS[arti.artifact.spec.name] === "Book of Basan") {
            data_object.prop_boost += BOOK_EFFECT[arti.artifact.spec.level][rarity]
        }

        stones.forEach((stone) => {
            if (EB_ARTIFACT_IDS[stone.name] === "Soul Stone") {
                data_object.soul_boost += SOUL_EFFECT[stone.level][stone.rarity]
            }
            if (EB_ARTIFACT_IDS[stone.name] === "Prophecy Stone") {
                data_object.prop_boost += PROP_EFFECT[stone.level][stone.rarity]
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
    let best_boost : {index : number, boost : myTypes.CumulBoost} = {
        index : -1,
        boost : {soul_boost : 0, prop_boost : 0}
    };
    for (let i = 0; i < all_eb_sets.length; i++) {
        const set_boost = determine_set_boost(all_eb_sets[i])
        if (set_boost.soul_boost >= best_boost.boost.soul_boost && set_boost.prop_boost >= best_boost.boost.prop_boost) {
            best_boost.boost = set_boost
            best_boost.index = i
        }
    }
    return all_eb_sets[best_boost.index];
}

// UI related code after this section

/**
 * boosts from information selected in the spreadsheet
 * @param boostData the data - see interface for actual data format
 * @returns the boost effect in {@link myTypes.CumulBoost}
 */
function determine_set_boost_extra(boostData : myTypes.SheetBoostData) : myTypes.CumulBoost {
    const data_object : myTypes.CumulBoost = {
        soul_boost : 0,
        prop_boost : 0,
    }
    data_object.prop_boost += BOOK_EFFECT[boostData.book.level][boostData.book.rarity]
    boostData.prop_stones.forEach((stoneList) => {
        data_object.prop_boost += (PROP_EFFECT[stoneList.level][0] * stoneList.amount)
    })
    boostData.soul_stones.forEach((stoneList) => {
        data_object.soul_boost += (SOUL_EFFECT[stoneList.level][0] * stoneList.amount)
    })
    return data_object;
}

/**
 * Simply creates the list for the dropdown so it's not global const
 */
function prop_stone_dropdown_information() : string[] {
    return [
        "Prophecy Stone - 0.05%",
        "Eggsquisite Prophecy Stone - 0.1%",
        "Radiant Prophecy Stone - 1%"
    ]
}

/**
 * creates dropdown information
 */
function soul_stone_dropdown_information() : string[] {
    return [
        "Soul Stone - 5%",
        "Eggsquisite Soul Stone - 10%",
        "Radiant Soul Stone - 25%"
    ]
}

/**
 * creates dropdown information
 */
function book_dropdown_information() : string[] {
    return [
        "T1 Book of Basan - 0.25%",
        "T2 Collectors Book of Basan - 0.5%",
        "T3C Fortified Book of Basan - 0.75%",
        "T3E Fortified Book of Basan - 0.8%",
        "T4C Glided Book of Basan - 1%",
        "T4E Glided Book of Basan - 1.1%",
        "T4L Glided Book of Basan - 1.2%"
    ]
}