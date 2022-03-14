
import { _decorator, Component, Node, tween, Sprite, Color, find, Vec3, easing } from 'cc';
import { FireflyController } from './FireflyController';
import { GameStateMachine } from './../GameStateMachine';
import { Anims } from './Anims';


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
        console.log(this.interCount);
        console.log(this.winCount);
        if(this.interCount == this.winCount){
            console.log("inter win");
            GameStateMachine.Instance.winState(this.needToWin - this.winCount)
            return
        }
        if(this.needToWin == this.winCount){   
            this.exitLevel()
        }
    }

    public exitLevel(){
        Anims.Instance.zebraWin()
        tween(this.node)
        .delay(1)
        .call(() => {
            this.controller.sing()
        })
        .delay(1)
        .call(() => {
            this.controller.blinkLines()
        })
        .delay(3)
        .call(() =>{
            GameStateMachine.Instance.winState()
        })
        .start()
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}