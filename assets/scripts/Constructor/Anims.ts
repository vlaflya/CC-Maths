
import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('Anims')
export class Anims extends Component {

    public static Instance: Anims
    @property({type: sp.Skeleton}) back: sp.Skeleton
    @property({type: sp.Skeleton}) zebra: sp.Skeleton

    onLoad () {
        Anims.Instance = this
        this.zebra.setMix("idle-sit-to-fin", "win-2", 0.5)
        this.back.setAnimation(1, "Track-fire", true)
        this.back.setAnimation(2, "Track-dude-idle", true)
        // this.zebraWin()
    }
    public zebraWin(){
        this.zebra.setAnimation(0, "idle-sit-to-fin", false)
        this.zebra.addAnimation(0, "win-2", true)
    }
}
