
import { _decorator, Component, Node, sp, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Lamp')
export class Lamp extends Component {
    @property({type: sp.Skeleton}) lamp: sp.Skeleton
    private lampBone: sp.spine.Bone
    private canHint: boolean = false
    start () {
        this.startTween()
    }

    public giveHint(){
        if(!this.canHint)
            return
        this.canHint = false
        console.log("Give hint");
        this.startTween()
    }

    private startTween(){
        this.lamp.setAnimation(0.5, "Idle", true)
        this.lampBone = this.lamp.findBone("Mask_transform")
        this.lampBone.x = 1000
        this.lampBone.y = 1000

        tween(this.lampBone)
        .to(5, {x: 0, y: 0})
        .call(() => {
            console.log("Can give hint");
            this.lamp.setAnimation(0.5, "Idle_Full", true)
            this.canHint = true
        })
        .start()
    }
}
