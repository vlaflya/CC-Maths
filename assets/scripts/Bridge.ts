
import { _decorator, Component, Node, director, game, JsonAsset, find, SpriteFrame, tween } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { LevelMap } from './LevelMap';
import { Transition } from './Constructor/Transition';
const { ccclass, property } = _decorator;

 @ccclass('Bridge')
export class Bridge extends Component {
    public static Instance: Bridge
    private levelCount: number = 0
    private maxLevels : number = 0
    private planets: Array<string> = []
    private planetNumbers: Array<number> = []
    @property({type: JsonAsset}) config: JsonAsset
    onLoad () {
        let conf: Array<any> = JSON.parse(JSON.stringify(this.config.json))
        this.maxLevels = conf.length
        for(let i = 0; i < this.maxLevels; i++){
            let lvl: levelInfo = conf[i]
            this.planets.push(lvl.planet)
            this.planetNumbers.push(lvl.planetNumber)
        }
        game.addPersistRootNode(this.node)
        Bridge.Instance = this
    }
    mapLoaded(){
        LevelMap.Instance.init(this.maxLevels, this.levelCount, this.levelCount, false, this.planets, this.planetNumbers);
    }
    public loadLevel(levelID){
        this.levelCount = levelID
        find("MetaCanvas").active = false
        find("GameCanvas").active = true
    }
    gameStateMachineInitialized(){
        GameStateMachine.Instance.readConfig(this.config, this.levelCount)
    }

    public exitLevel(){
        Transition.Instance.transitionIn()
        tween(this.node)
        .delay(1)
        .call(() => {
            director.loadScene("scene")
        })
        .start()
    }
    
    win(){
        this.levelCount++
        if(this.levelCount == this.maxLevels){
            this.levelCount = 0
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
    planetNumber: number
}