export class GameSave {
    readonly save: saveTypes.Root;

    /**
     * initializes the save variable of this instance 
     * 
     * @param EID the EID of the current user of this script
     */
    constructor (EID: string) {
        this.save = JSON.parse(UrlFetchApp.fetch(`https://ei_worker.tylertms.workers.dev/backup?EID=${EID}`).getContentText())
    }

    /**
     * Returns the JSON save of the user
     * 
     * @returns JSON save file
     */
    get gamesave() : saveTypes.Root {return this.save}

    /**
     * Returns the se of the save
     * 
     * @returns SE count as number 
     */
    get SE(): number { return this.save.game.soulEggsD }
    
    /**
     * Returns pe count of the save
     * 
     * @returns PE count as number
     */
    get PE(): number { return this.save.game.eggsOfProphecy }
    
    /**
     * Returns the number of prestiges
     * 
     * @returns Prestige Number as number
     */
    get prestiges(): number { return this.save.stats.numPrestiges }
    
    /**
     * Gets the UNIX time of save 
     * 
     * @returns UNIX time of save as number
     */
    get time(): number { return Math.floor(this.save.settings.lastBackupTime) }
  
    /**
     * Returns a JSON of the ER in the save
     * 
     * @returns ER
     */
    get ER() : saveTypes.EpicResearchList[] { return this.save.game.epicResearchList }

    /**
     * returns saved sets found in the save
     */
    get arti_sets() : saveTypes.SavedArtifactSetsList[] {
        return this.save.artifactsDb.savedArtifactSetsList
    }

    /**
     * returns all artifacts found within the save
     */
    get get_arti_inv() : saveTypes.InventoryItemsList[] {
        return this.save.artifactsDb.inventoryItemsList
    }

    /**
     * gets the soul bonus epic research amount
     * 
     * @returns the soul bonus ER levels
     */
    get soul_bonus() : number { 
        let soulER = this.ER.find((research : {id : string, level : number}) => research.id === "soul_eggs")
        // If no item is found, then assume that there is 0 ER
        return soulER ? soulER.level : 0   
    }

    /**
     * returns the prop bonus ER level
     * 
     * @returns prop bonus ER level
     */
    get prop_bonus() : number {
        let propER = this.ER.find((research : {id : string, level : number}) => research.id === "prophecy_bonus")
        return propER ? propER.level : 0
    }

    /**
     * Gets the path object of requested path
     * @param path path of the intended object in the JSON save
     * @returns JSON of the requested path if found, otherwise null
     */
    get_path(path: string): any {
        let paths : any = path.split(".")
        let current_item : any = this.gamesave
        for (let i = 0; i < paths.length; i++) {
            if (!current_item[paths[i]]) {
                return null
            } else {
                if (i == paths.length - 1) {
                    return current_item[paths[i]]
                } else {
                    current_item = current_item[paths[i]]
                }
            }
        }
    }
    
    /**
     * Calculates and returns the eb of the save
     * 
     * @returns the eb of the save as number
     */
    calc_EB(): number {
        return (this.SE*(10+this.soul_bonus))*(((1.05 + (0.01 * this.prop_bonus))**this.PE))
    }
    
    /**
     * returns the MER of the save
     *
     * @returns MER of the save as number
     */
    calc_MER(): number { return (((91 * (Math.log10(this.SE) - 18)) + 200 - this.PE) / 10) }
    
    /**
     * returns the JER of the save
     * 
     * @returns the JER of the save as number
     */
    calc_JER(): number { return (((0.1519*Math.log10(this.SE)**3 - 4.8517*Math.log10(this.SE)**2 + 48.248*Math.log10(this.SE) - 143.46)/this.PE)*100*this.PE+100*49)/(this.PE+100)}
    
    /**
     * Wrapper get for calc_EB()
     * 
     * @returns the the EB of the save as number
     */
    get EB(): number { return this.calc_EB() }
  
    /**
     * Wrapper for calc_MER()
     * 
     * @returns the MER of the save as number
     */
    get MER(): number { return this.calc_MER() }
  
    /**
     * Wrapper for calc_JER()
     * 
     * @returns JER of save as number
    */
    get JER(): number { return this.calc_JER() }
}