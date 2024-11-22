declare namespace myClasses {
    import SheetDataArray = myTypes.SheetDataArray;
    import SheetBoostData = myTypes.SheetBoostData;

    export interface GameSave {
        readonly save: saveTypes.Root;

        /**
         * There is no constructors in interface
         * will @ts-ignore/@ts-expect-error
         * all constructor calls.
         */

        get gamesave(): saveTypes.Root;
        get SE(): number;
        get PE(): number;
        get prestiges(): number;
        get time(): number;
        get ER(): saveTypes.EpicResearchList[];
        get arti_sets(): saveTypes.SavedArtifactSetsList[];
        get get_arti_inv(): saveTypes.InventoryItemsList[];
        get soul_bonus(): number;
        get prop_bonus(): number;
        get_path(path: string): any;
        calc_EB(): number;
        calc_MER(): number;
        calc_JER(): number;
        get EB(): number;
        get MER(): number;
        get JER(): number;
        get sheetData() : SheetDataArray;
    }

    // In testing, refactoring code to use this later
    export interface AppScriptUiInterface {
        save : myClasses.GameSave;
        t3_prop_count : number;
        t2_prop_count : number;
        t1_prop_count : number;
        t3_soul_count : number;
        t2_soul_count : number;
        t1_soul_count : number;
        book_level : number;
        book_rarity : number;
        readonly stones_dropdown : string[];
        readonly book_dropdown_map : Map<string, string>;

        /**
         * this function is only used to instantiate
         * prop and soul counts given a gamesave
         */
        setup_class_variables() : void;

        get stone_dropdown_values() : string[];
        get boost_data() : myTypes.SheetBoostData;
        get stone_list() : myTypes.StoneList
        get book() : SheetBoostData["book"];
        convert_book_into_string(book : SheetBoostData["book"]) : string;
        convert_string_into_book(input : string) : SheetBoostData["book"];
    }
}
