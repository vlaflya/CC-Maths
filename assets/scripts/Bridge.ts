
import { _decorator, Component, Node, director, game, JsonAsset, find, SpriteFrame, tween } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { LevelMap } from './LevelMap';
import { Transition } from './Constructor/Transition';
import { WinChecker } from './Constructor/WinChecker';
const { ccclass, property } = _decorator;

 @ccclass('Bridge')
export class Bridge extends Component {
    public static Instance: Bridge = null
    private curLevel = 0
    public levelCount: number = 0
    private maxLevels : number = 0
    private planets: Array<string> = []
    private planetNumbers: Array<number> = []
    private unlockNew = false
    public formCatalogue = true
    public dto: InitializeDto = null
    public inGame = false

    private _onPaused;
    private _onUnpaused;
    private _onContinueGame;
    public initialized: boolean = false;

    @property({type: JsonAsset}) config: JsonAsset

    AddCallbacks(onPaused, onUnpaused, onSubscriptionChanged, onContinueGame) {
        this._onPaused = onPaused;
        this._onUnpaused = onUnpaused;
        this._onContinueGame = onContinueGame;
    }

    ClearCallbacks() {
        window.Game.PAUSE = () => { };
        window.Game.UNPAUSE = () => { };
        window.Game.SUBSCRIPTION_CHANGED = () => { };
        window.Game.CONTINUE_GAME = () => { };
    }

    onLoad () {
        if(Bridge.Instance != null)
            this.node.destroy()
        this.curLevel = this.levelCount
        let conf: Array<any> = JSON.parse(JSON.stringify(this.config.json))
        this.maxLevels = conf.length
        for(let i = 0; i < this.maxLevels; i++){
            let lvl: levelInfo = conf[i]
            this.planets.push(lvl.planet)
            this.planetNumbers.push(lvl.planetnumber)
        }
        console.log("Bridge load");
        game.addPersistRootNode(this.node)
        Bridge.Instance = this
        if(window.Unity){
            console.log("oke", "In Unity")
            // this.exitButton.active = false
            console.log("oke", "Button Overriden")
            this.InitializeProtocol((dto, callWrapperStart) => this.onInitialized(dto, callWrapperStart))
            console.log("oke", "After Inittialize")
        }
    }

    private async loadData(){
        const st = await this.LoadProgress()
        console.log("Progress loaded");
        let count: number
        if(!st){
            count = 0
        }
        else{
            count = parseInt(st)
        }
        this.levelCount = count 
        window.Unity.START()
        this.mapLoaded()
    }

    private async LoadProgress(): Promise<string> {
        return new Promise(resolve => {
            window.Unity && window.Unity.LOAD_PROGRESS(function (progress) {
                resolve(progress);
            })
        });
    }

    mapLoaded(){
        this.inGame = false
        console.log(this.levelCount);
        LevelMap.Instance.init(this.maxLevels, this.curLevel, this.levelCount, this.unlockNew, this.planets, this.planetNumbers);
        if(this.unlockNew)
            this.unlockNew = false
    }
    public loadLevel(levelID){
        this.curLevel = levelID
        find("MetaCanvas").active = false
        find("GameCanvas").active = true
    }
    gameStateMachineInitialized(){
        GameStateMachine.Instance.readConfig(this.config, this.curLevel)
    }

    public save(){
        this.SaveProgress(this.levelCount)
    }

    public exitLevel(){
        this.save()
        Transition.Instance.transitionIn()
        tween(this.node)
        .delay(1)
        .call(() => {
            console.log(this.levelCount);
            director.loadScene("scene")
        })
        .start()
    }
    win(){
        this.unlockNew = true
        this.levelCount++
        if(this.levelCount == this.maxLevels){
            console.log("Reset");
            this.unlockNew = false
            this.levelCount--
        }
        this.exitLevel()
    }

    public unlockOne(){
        this.unlockNew = false
        this.levelCount++
        this.exitLevel()
    }

    public unlockAll(){
        this.unlockNew = false
        this.levelCount = 39
        this.exitLevel()
    }

    private onClick(){
        if(this.inGame){
            this.exitLevel()
        }
        else{
            window.Unity && window.Unity.SHOW_RECOMMEND_WITHOUT_CATALOG_BTN();
        }
    }
    OverrideBackButtonAction(action) {
        console.log("oke", "Button Override0");
        const button = document.querySelector(".back-button-wrapper")
        console.log("oke", "Button Override1");
        const origLink = button.children[0]
        console.log("oke", "Button Override2");
        const copy = origLink.cloneNode(true)
        console.log("oke", "Button Override3");
        button.removeChild(origLink)
        console.log("oke", "Button Override4");
        button.appendChild(copy)
        console.log("oke", "Button Override5");
        copy.addEventListener("click", function(){
            action();
        })
        console.log("oke", "Button Override6");
    }
    InitializeProtocol(onInitialized: (dto: InitializeDto, callWrapperStart) => void) {
        console.log("oke" ,'Cocos Bridge.InitializeProtocol...');
        let self = this;
        window.Game = window.Game || {};
        window.Game.INITIALIZE = function (args) {
            console.log('Cocos Bridge.INITIALIZE', args)
            let dto = <InitializeDto>JSON.parse(JSON.stringify(args));
            let callWrapperStart = function() {window.Unity.START()};
            onInitialized(dto, callWrapperStart);
        }

        window.Game.PAUSE = function() { self.onPaused() };
        window.Game.UNPAUSE = function() { self.onUnpaused() };
        window.Game.CONTINUE_GAME = function (args) {self.onContinueGame(args); };

        (function () {
            if(window.Unity){
                var timer = setInterval(function () {
                    console.log('Cocos Bridge.InitializeProtocol: Waiting for READY...');
                    if (window.Unity && window.Unity.READY) {
                        console.log('Cocos Bridge.InitializeProtocol: READY!')
                        clearInterval(timer)
                    }
                    window.Unity.READY()
                }, 250)
            }
        })()
    }
    onInitialized(dto, callWrapperStart){
        console.log("Game Initialized")
        this.OverrideBackButtonAction(() => {
            this.onClick()
        })
        this.dto = dto
    }
    getLanguage(): string{
        let ret = ""
        if(window.Unity && this.dto != null)
            ret = this.dto.language
        return ret
    }

    public reload(){
        // reset
    }
    private onUnpaused() {
        console.log(`Cocos Bridge.onUnpaused`);
        if (this._onUnpaused)
            this._onUnpaused();
    }
    private onPaused() {
        console.log(`Cocos Bridge.onPaused`);
        if (this._onPaused)
            this._onPaused();
    }

    private onContinueGame(args) {
        if (this._onContinueGame)
            this._onContinueGame(args);
    }

    public async SaveProgress(count: number) {
        await new Promise(resolve => {
            window.Unity && window.Unity.SAVE_PROGRESS(count.toString(), function () {
                resolve(null);
            })
        });
    }

}
interface levelInfo{
    level: number
    stage1count: number
    stage1reverced: string
    stage2choice: string
    constructorconfig: string
    stage3: string
    planet: string
    planetnumber: number
}
export class InitializeDto {
    parentId: number;
    activityBlockerEnabled: boolean;
    authTokenChild: string;
    authTokenParen: string;
    language: string;
    os: string;
    timer: string;
    childName: string;
    childAge: string;
    configUrl: string;
    clientVersion: string;
    soundSettings: SoundSettings;
    dev: boolean;
    webgame: WebGameInfo;
    displayLanguage: string;
}

export class WebGameInfo {
    id: string;
    version: string;
    game_content_event_name: string;
    gameParams: object;
    contentAccess: ContentAccessLevel;
}


export class SoundSettings {
    FXLevel: number;
    VoiceLevel: number;
    MusicLevel: number;
    AmbientLevel: number;

    public toString = (): string => {
        return `FXLevel = ${this.FXLevel}; VoiceLevel = ${this.VoiceLevel}; MusicLevel = ${this.MusicLevel}; AmbientLevel = ${this.AmbientLevel}`;
    }
}

export enum ContentAccessLevel {
    none, limited, full
}

export const FreeContentAccessAmount: string = "freeContentAmount";

export function GetFreeContentAmount(gameParams: object): number {
    try {
        return <number>gameParams[FreeContentAccessAmount];
    }
    catch {
        return -1;
    }
}