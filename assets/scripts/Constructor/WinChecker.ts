
import { _decorator, Component, Node, tween, Sprite, Color, find, Vec3, easing } from 'cc';
import { FireflyController } from './FireflyController';
import { GameStateMachine } from './../GameStateMachine';


const { ccclass, property } = _decorator;

@ccclass('WinChecker')
export class WinChecker extends Component {
    @property({type: FireflyController}) controller: FireflyController
    @property({type: Node}) finalParticle: Node
    @property({type: Node}) container: Node
    needToWin: number
    winCount: number = 0
    interCount: number = 1000
    public static Instance: WinChecker

    onLoad(){
        WinChecker.Instance = this
    }
    public Initialize(needWin: number, inter: number){
        this.needToWin = needWin
        this.interCount = inter
    }
    public CheckWin(){
        this.winCount++
        if(this.interCount == this.winCount){
            GameStateMachine.Instance.winState(this.needToWin - this.winCount)
            return
        }
        if(this.needToWin == this.winCount){
            GameStateMachine.Instance.winState()
            return
        }
        console.log(this.needToWin + " " + this.winCount);
    }

    public exitLevel(){
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}