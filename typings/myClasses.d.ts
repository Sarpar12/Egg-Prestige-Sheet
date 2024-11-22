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
        get book_dropdown_values() : string[];
        get prop_dropdown_values() : string[];
        get soul_dropdown_values() : string[];
        convert_book_into_string(book : SheetBoostData["book"]) : string;
        convert_string_into_book(input : string) : SheetBoostData["book"];
    }
}
