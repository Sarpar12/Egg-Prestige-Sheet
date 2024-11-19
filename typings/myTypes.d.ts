declare namespace myTypes {
    export interface SheetDataArray {
        EB : number
        SE : number
        PE : number
        Prestiges : number
        Time : string
        MER : number
        JER : number
    }

    export interface CumulBoost {
        soul_boost : number
        prop_boost : number
    }

    export interface SheetBoostData {
        book : {level : number, rarity : number} // <level, rarity>
        soul_stones : {level : number, amount : number}[] // [<amount, level>]
        prop_stones : {level : number, amount : number}[] // [<amount, level>]
    }
}