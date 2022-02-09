
import { _decorator, Component, Node, sp, tween } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('SkeletonButtons')
export class SkeletonButton extends Component {
    private skeleton: sp.Skeleton
    onLoad () {
        this.skeleton = this.getComponent(sp.Skeleton)
    }
    public reset(){
        // this.skeleton.setSkin("Button-Active")
        this.skeleton.setAnimation(0, "idle", false)
    }
    public callback(event, customEventData){
        this.skeleton.setAnimation(0, "tap", false)
        // tween(this.node)
        // .delay(0.5)
        // .call(() => {
        //     this.skeleton.setSkin("Button-No-Active")
        // })
        // .start()
    }
}
