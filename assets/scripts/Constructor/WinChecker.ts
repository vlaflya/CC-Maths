
import { _decorator, Component, Node, tween, Sprite, Color, find, Vec3, easing } from 'cc';
import { FireflyController } from './FireflyController';
import { GameStateMachine } from './../GameStateMachine';
import { Anims } from './Anims';
import { Bridge } from '../Bridge';
import { SoundManager } from '../SoundManager';


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
        console.log("Need win " + needWin);
        console.log("Inter win " + inter);
        this.needToWin = needWin
        this.interCount = inter
        if(inter == needWin)
            this.interCount = 1000
    }
    public CheckWin(){
        this.winCount++
        console.log(this.interCount);
        console.log(this.winCount);
        if(this.interCount == this.winCount){
            console.log("inter win");
            let level = Bridge.Instance.levelCount
            let delay = 0
            switch(level){
                case 17:{
                    delay = SoundManager.Instance.playConstructorEndPhase1(0)
                    break
                }
                case 18:{
                    delay = SoundManager.Instance.playConstructorEndPhase1(1)
                    break
                }
                case 19:{
                    delay = SoundManager.Instance.playConstructorEndPhase1(2)
                    break
                }
            }
            tween(this.node)
            .delay(delay)
            .call(() => {
                GameStateMachine.Instance.winState(this.needToWin - this.winCount)
            })
            .start()
            return
        }
        if(this.needToWin == this.winCount){   
            this.exitLevel()
        }
    }

    public exitLevel(){
        Anims.Instance.zebraWin()
        SoundManager.Instance.playConstructorFinish()
        tween(this.node)
        .delay(1)
        .call(() => {
            this.controller.sing()
        })
        .delay(1)
        .call(() => {
            this.controller.blinkLines()
        })
        .delay(5)
        .call(() =>{
            console.log("exit level");
            GameStateMachine.Instance.winState()
        })
        .start()
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}