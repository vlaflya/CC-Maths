
import { _decorator, Component, Node, tween, Sprite, Color, find, Vec3, easing } from 'cc';
import { FireflyController } from './FireflyController';


const { ccclass, property } = _decorator;

@ccclass('WinChecker')
export class WinChecker extends Component {
    @property({type: FireflyController}) controller: FireflyController
    @property({type: Node}) finalParticle: Node
    @property({type: Node}) container: Node
    needToWin: number
    winCount: number = 0
    public static Instance: WinChecker

    onLoad(){
        WinChecker.Instance = this
    }
    public Initialize(needWin: number){
        this.needToWin = needWin
    }
    public CheckWin(){

    }

    public exitLevel(){
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}