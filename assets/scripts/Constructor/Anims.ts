
import { _decorator, Component, Node, sp, randomRange, randomRangeInt, tween } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('Anims')
export class Anims extends Component {

    public static Instance: Anims
    @property({type: sp.Skeleton}) back: sp.Skeleton
    @property({type: sp.Skeleton}) zebra: sp.Skeleton
    private canTap = true;

    onLoad () {
        Anims.Instance = this
        this.zebra.setMix("idle-sit-to-fin", "win-2", 0.5)
        this.back.setAnimation(1, "Track-fire", true)
        this.back.setAnimation(2, "Track-dude-idle", true)

        this.back.setMix("idle", "Track-tap-2", 0.5)
        this.back.setMix("Track-tap-2", "idle", 0.5)

        this.back.setMix("idle", "Track-tap-3", 0.5)
        this.back.setMix("Track-tap-3", "idle", 0.5)

        this.back.setMix("Track-fire-to-off", "Track-fire-off", 0.5)
        // this.zebraWin()
    }
    public tapCallback(){
        if(!this.canTap)
            return
        this.canTap = false
        console.log("TapCallback")
        let r = randomRangeInt(0,2)
        if(r == 0)
            this.back.setAnimation(3, "Track-tap-2", false)
        if(r > 0)
            this.back.setAnimation(3, "Track-tap-3", false)
        this.back.addAnimation(3, "idle", true)
        tween(this.node)
        .delay(2)
        .call(() => {
            this.canTap = true
        })
        .start()
    }
    public zebraWin(){
        this.zebra.setAnimation(0, "idle-sit-to-fin", false)
        this.zebra.addAnimation(0, "win-2", true)
        this.back.setAnimation(3, "Track-tap-4", false)
        this.back.setAnimation(4, "Track-fire-to-off", false)
        this.back.addAnimation(4, "Track-fire-off", false)
    }
}
