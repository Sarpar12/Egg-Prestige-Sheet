declare namespace myClasses {
    import SheetDataArray = myTypes.SheetDataArray;

    export interface GameSave {
        readonly save: saveTypes.Root;

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
}
