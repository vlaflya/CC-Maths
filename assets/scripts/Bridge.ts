
import { _decorator, Component, Node, director, game, JsonAsset, find, SpriteFrame, tween } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { LevelMap } from './LevelMap';
import { Transition } from './Constructor/Transition';
const { ccclass, property } = _decorator;

 @ccclass('Bridge')
export class Bridge extends Component {
    public static Instance: Bridge = null
    private curLevel = 0
    public levelCount: number = 17
    private maxLevels : number = 0
    private planets: Array<string> = []
    private planetNumbers: Array<number> = []
    private unlockNew = false
    public formCatalogue = true
    @property({type: JsonAsset}) config: JsonAsset
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
    }
    mapLoaded(){
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

    public exitLevel(){
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