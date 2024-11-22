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

    /**
     * Note that this interface is supposed to have levels 0, 1, 2
     * anything else WILL break the code
     *
     * Changed to allow for easier indexing with stone.level
     * instead of using if (stone.level === 1), etc
     */
    export interface SheetBoostData {
        book: { level: number, rarity: number }
        soul_stones: Record<number, number>
        prop_stones: Record<number, number>
    }

    export interface StoneList {
        prop_stones : number[]
        soul_stones : number[]
    }
}