
import { _decorator, Component, Node, sp, tween } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('SkeletonButtons')
export class SkeletonButton extends Component {
    private skeleton: sp.Skeleton
    onLoad () {
        this.skeleton = this.getComponent(sp.Skeleton)
        this.skeleton.setMix("idle", "tap", 0.1)
        this.skeleton.setMix("tap", "idle", 0.1)
    }
    public reset(){
        this.skeleton.timeScale = 1
        this.skeleton.setSkin("Button-Active-1")
        this.skeleton.setAnimation(0, "idle", false)
    }
    public callback(event, customEventData){
        this.skeleton.setAnimation(0, "tap", false)
        tween(this.node)
        .delay(0.11)
        .call(() => {
            // this.skeleton.timeScale = -1
            this.skeleton.setSkin("Button-No-Active-1")
            // this.skeleton.setAnimation(0, "tap", false)
            this.skeleton.addAnimation(0, "idle", true)
        })
        .start()
    }
}
