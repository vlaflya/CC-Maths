
import { _decorator, Component, Node, director, game, JsonAsset } from 'cc';
import { GameStateMachine } from './GameStateMachine';
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
