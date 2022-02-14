
import { _decorator, Component, Node, sp, tween } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('SkeletonButtons')
export class SkeletonButton extends Component {
    @property({type: sp.Skeleton}) skeleton: sp.Skeleton
    public isCurrent: boolean  = false 
    onLoad () {
        this.skeleton.setMix("idle", "tap", 0.1)
        this.skeleton.setMix("tap", "idle", 0.1)
    }
    public reset(){
        this.isCurrent = false
        this.skeleton.timeScale = 1
        this.skeleton.setSkin("Button-Active-1")
        this.skeleton.setAnimation(0, "idle", false)
    }
    public callback(event, customEventData){
        this.skeleton.setAnimation(0, "tap", false)
        tween(this.node)
        .delay(0.11)
        .call(() => {
            if(!this.isCurrent)
                this.skeleton.setSkin("Button-No-Active-1")
            this.skeleton.addAnimation(0, "idle", true)
        })
        .start()
    }
}
