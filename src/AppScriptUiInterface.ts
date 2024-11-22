export class AppScriptUiInterface implements myClasses.AppScriptUiInterface {
    save : myClasses.GameSave
    t3_prop_count : number;
    t2_prop_count : number;
    t1_prop_count : number;
    t3_soul_count : number;
    t2_soul_count : number;
    t1_soul_count : number;
    book_level : number;
    book_rarity : number;

    // Const Variables
    readonly stones_dropdown : string[] = ["Regular", "Eggsquisite", "Radiant Soul" ];
    readonly book_dropdown_map : Map<string, string> = new Map<string, string>([
        ["-10", "None"], // Value for 0
        ["00", "T1"],
        ["10", "T2C"],
        ["20", "T3C"],
        ["21", "T3E"],
        ["30", "T4C"],
        ["32", "T4E"],
        ["33", "T4L"]
    ]);

    /**
     * overloaded constructors
     * @param save the save class
     */
    constructor(save : myClasses.GameSave);
    constructor(boost_data : myTypes.SheetBoostData);
    constructor(sheet_data : string[][]);
    constructor(arg : myClasses.GameSave | myTypes.SheetBoostData | (string | number)[][]) {
        // Instance of
        if (arg instanceof Array) {
            let book = convert_string_into_book(arg[0][0] as string)
            this.book_level = book.level
            this.book_rarity = book.rarity
            let soul_stones = arg[1] as number[];
            this.t1_soul_count = soul_stones[0] as number;
            this.t2_soul_count = soul_stones[1] as number;
            this.t3_soul_count = soul_stones[2] as number;
            let prop_stones = arg[2] as number[];
            this.t1_prop_count = prop_stones[0] as number;
            this.t2_prop_count = prop_stones[1] as number;
            this.t3_soul_count = prop_stones[2] as number;
        }
        // instance of GameSave
        else if ('save' in arg) {
            let stones = determine_stones_in_set(find_best_eb_set(arg, arg.get_arti_inv))
            this.instantiate_with_boostData(stones);
        }
        else {
            this.instantiate_with_boostData(arg)
        }
    }

    instantiate_with_boostData(boost_data : myTypes.SheetBoostData) {
        this.book_level = boost_data.book.level;
        this.book_rarity = boost_data.book.level;
        this.t1_soul_count = boost_data.soul_stones[0]
        this.t2_soul_count = boost_data.soul_stones[1]
        this.t3_soul_count = boost_data.soul_stones[2]
        this.t1_prop_count = boost_data.prop_stones[0]
        this.t2_prop_count = boost_data.prop_stones[1]
        this.t3_prop_count = boost_data.prop_stones[2]
    }

    setup_class_variables() : void {
        Logger.log("test")
    };

    // Getters
    get stone_dropdown_values() : string[] {
        return this.stones_dropdown
    }

    get stone_list() : myTypes.StoneList {
        return {
            prop_stones : [this.t1_prop_count, this.t2_prop_count, this.t3_prop_count],
            soul_stones : [this.t1_soul_count, this.t2_soul_count, this.t3_soul_count]
        }
    }

    get book() : myTypes.SheetBoostData["book"] {
        return {
            level : this.book_level,
            rarity : this.book_rarity,
        }
    }

    get boost_data() : myTypes.SheetBoostData {
        return {
            book : {
                level : this.book_level,
                rarity : this.book_rarity,
            },
            soul_stones : { 0 : this.t1_soul_count, 1 : this.t2_soul_count, 2 : this.t3_soul_count },
            prop_stones : { 0 : this.t1_prop_count, 1 : this.t2_prop_count, 2 : this.t3_prop_count },
        }
    }

    // actual functions
    convert_book_into_string(book: myTypes.SheetBoostData["book"]): string {
        return this.book_dropdown_map.get(`${book.level}${book.rarity}`);
    };

    convert_string_into_book(input : string) : myTypes.SheetBoostData["book"] {
        const object = {
            level : 0,
            rarity : 0
        }
        object.level = parseInt(input[1]) - 1
        object.rarity = ((input: string): number => {
            if (input[2] === "C") return 0;
            if (input[2] === "E") return 2;
            if (input[2] === "L") return 3;
            return 0; // Default case for "U" (Uncommon) or any other value
        })(input);
        // Default value of 0 for returning an object
        return object;
    }

}