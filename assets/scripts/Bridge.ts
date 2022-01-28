
import { _decorator, Component, Node, director, game, JsonAsset, find } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { LevelMap } from './LevelMap';
import { Transition } from './Constructor/Transition';
const { ccclass, property } = _decorator;

 @ccclass('Bridge')
export class Bridge extends Component {
    public static Instance: Bridge
    private levelCount: number = 0
    private maxLevels : number = 0
    @property({type: JsonAsset}) config: JsonAsset
    onLoad () {
        let conf: Array<any> = JSON.parse(JSON.stringify(this.config.json))
        this.maxLevels = conf.length
        game.addPersistRootNode(this.node)
        Bridge.Instance = this
    }
    mapLoaded(){
        LevelMap.Instance.init(this.maxLevels, this.levelCount, this.maxLevels, false);
    }
    public loadLevel(levelID){
        this.levelCount = levelID
        find("MetaCanvas").active = false
        find("GameCanvas").active = true
    }
    gameStateMachineInitialized(){
        GameStateMachine.Instance.readConfig(this.config, this.levelCount)
    }
    
    win(){
        this.levelCount++
        if(this.levelCount == this.maxLevels){
            this.levelCount = 0
        }
        director.loadScene("scene")
    }

}
