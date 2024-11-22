export class AppScriptUiInterface implements AppScriptUiInterface {
    readonly save : myClasses.GameSave

    constructor(save : myClasses.GameSave) {
        this.save = save
    }
}