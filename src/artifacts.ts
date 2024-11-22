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
    Object.keys(boostData.prop_stones).forEach((string_key) => {
        const level : number = parseInt(string_key)
        const amount : number = boostData.prop_stones[level]
        data_object.prop_boost += (PROP_EFFECT[level][0] * amount)
    })
    Object.keys(boostData.soul_stones).forEach((string_key) => {
        const level : number = parseInt(string_key)
        const amount : number = boostData.soul_stones[level]
        data_object.soul_boost += (SOUL_EFFECT[level][0] * amount)
    })
    return data_object;
}

/**
 * returns the stones in the set in {@link myTypes.SheetBoostData} format
 *
 * data here will be used to prefill the sheet
 *
 * @param arti_set the set to scan
 */
function determine_stones_in_set(arti_set : saveTypes.InventoryItemsList[]) : myTypes.SheetBoostData {
    const stone_data : myTypes.SheetBoostData = {
        book : {level : -1, rarity : 0},
        soul_stones : {0 : 0, 1 : 0, 2 : 0},
        prop_stones : {0 : 0, 1 : 0, 2 : 0},
    }
    arti_set.forEach((arti) => {
        // Determine if bob, set value if bob
        if (EB_ARTIFACT_IDS[arti.artifact.spec.name] === "Book of Basan") {
            stone_data.book = {level : arti.artifact.spec.level, rarity : arti.artifact.spec.rarity}
        }
        // Determine if a given artifact has eb stones
        arti.artifact.stonesList.forEach((stone) => {
            // either uses the level value, or 0, whichever is more truthy first
            stone_data.soul_stones[stone.level] = (stone_data.soul_stones[stone.level] || 0) + 1;
        })
    })
    return stone_data
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
        "None",
        "T1C",
        "T2C",
        "T3C",
        "T3E",
        "T4C",
        "T4E",
        "T4L"
    ]
}

/**
 * simply to prefill
 * could be easier to algorithmically generate if it was simply T4l, etc
 * @param sheetData
 */
function convert_book_info_into_string(sheetData : myTypes.SheetBoostData) : string {
    const info_map : Map<string, string> = new Map<string, string>([
        ["-10", "None"],
        ["00", "T1"],
        ["10", "T2C"],
        ["20", "T3C"],
        ["21", "T3E"],
        ["30", "T4C"],
        ["32", "T4E"],
        ["33", "T4L"]
    ])
    return info_map.get(`${sheetData.book.level}${sheetData.book.rarity}`)
}

/**
 * converts a string from the book library into a book object
 * @param input the input string
 */
function convert_string_into_book(input : string) {
    const object = {
        level : 0,
        rarity : 0
    }
    object.level = parseInt(input[1])
    object.rarity = ((input: string): number => {
        if (input[3] === "C") return 0;
        if (input[3] === "E") return 2;
        if (input[3] === "L") return 3;
        return 0; // Default case for "U" (Uncommon) or any other value
    })(input);
    // Default value of 0 for returning an object
    return object;
}

/**
 * converts the more abstract object notation into a simplier object containing a list
 * @param sheetData the object containing stone information
 */
function convert_stone_data_into_list(sheetData : myTypes.SheetBoostData) : myTypes.StoneList {
    return {
        prop_stones : [sheetData.prop_stones[0], sheetData.prop_stones[1], sheetData.prop_stones[2]],
        soul_stones : [sheetData.soul_stones[0], sheetData.soul_stones[1], sheetData.soul_stones[2]]
    }
}

/**
 * converts a list of stones into a data object
 * @param data_list
 */
function convert_stone_list_into_data(data_list : myTypes.StoneList) : {soul_stones: { [key: number] : number},
    prop_stones: { [key: number] : number }} {
    return {
        soul_stones : {0 : data_list.soul_stones[0], 1 : data_list.soul_stones[1], 2 : data_list.soul_stones[2]},
        prop_stones : {0 : data_list.prop_stones[0], 1 : data_list.prop_stones[2], 2 : data_list.prop_stones[2]}
    }
}